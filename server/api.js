const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');
const { normalizePhone } = require('./phone');

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  dateStrings: true,   //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回.
  multipleStatements: true    // 多语句查询
});

const clinicPrefixPattern = /^[A-Za-z0-9_]+$/;

function clinicTables(prefix) {
  if (!clinicPrefixPattern.test(prefix || '')) {
    throw new Error('诊所标识无效');
  }
  return {
    patient: prefix + 'patient',
    order: prefix + 'ordlist',
    medicine: prefix + 'medlist',
    gaofang: prefix + 'gaofang',
    mergeLog: prefix + 'patient_merge_log',
  };
}

function query(connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => err ? reject(err) : resolve(result));
  });
}

function inTransaction(work, res) {
  pool.getConnection((connectionError, connection) => {
    if (connectionError) return res.status(500).json({ error: '数据库连接失败' });
    connection.beginTransaction(async beginError => {
      if (beginError) {
        connection.release();
        return res.status(500).json({ error: '无法开始数据库事务' });
      }
      try {
        const result = await work(connection);
        connection.commit(commitError => {
          connection.release();
          if (commitError) return res.status(500).json({ error: '提交数据库事务失败' });
          res.json(result);
        });
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          res.status(400).json({ error: error.message || '保存失败' });
        });
      }
    });
  });
}

function parsePagination(queryParams, defaultPageSize = 30) {
  const page = queryParams.page === undefined ? 1 : Number(queryParams.page);
  const pageSize = queryParams.pageSize === undefined ? defaultPageSize : Number(queryParams.pageSize);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error('分页参数无效');
  }
  return { page, pageSize, offset: (page - 1) * pageSize };
}

function escapeLike(value) {
  return String(value).replace(/[\\%_]/g, character => '\\' + character);
}

function getSearchKeyword(value) {
  const keyword = String(value == null ? '' : value).trim();
  if (keyword.length > 50) throw new Error('搜索关键词过长');
  return keyword;
}

function authorizePatientMerge(req) {
  const token = String((req.body && req.body.token) || req.query.token || '');
  const prefix = (req.body && req.body.dbPrefix) || req.query.dbPrefix;
  const tables = clinicTables(prefix);
  if (!token) return Promise.reject(new Error('请重新登录后操作'));
  return new Promise((resolve, reject) => {
    pool.query('SELECT id, role, dbs_prefix FROM myDbs_user WHERE token = ? LIMIT 1', [token], (error, users) => {
      if (error) return reject(new Error('验证管理员身份失败'));
      const user = users[0];
      if (!user || user.role !== 'admin' || user.dbs_prefix !== prefix) return reject(new Error('无患者合并权限'));
      resolve(tables);
    });
  });
}

module.exports = {
  listPatientMergeGroups(req, res, next) {
    let pagination;
    let keyword;
    try {
      pagination = parsePagination(req.query);
      keyword = getSearchKeyword(req.query.name);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    authorizePatientMerge(req).then(tables => {
      const likeKeyword = '%' + escapeLike(keyword) + '%';
      const base = ' FROM ?? WHERE merge_status = \'active\' AND name LIKE ? GROUP BY name HAVING COUNT(*) > 1';
      const countSql = 'SELECT COUNT(*) AS total FROM (SELECT name' + base + ') AS duplicate_groups';
      const listSql = 'SELECT name, COUNT(*) AS patient_count, SUM(visitTimes) AS visit_times' + base + ' ORDER BY patient_count DESC, name LIMIT ? OFFSET ?';
      pool.getConnection((error, connection) => {
      if (error) return res.status(500).json({ error: '数据库连接失败' });
      connection.query(countSql, [tables.patient, likeKeyword], (countError, countResult) => {
        if (countError) { connection.release(); return res.status(500).json({ error: '查询重复患者失败' }); }
        connection.query(listSql, [tables.patient, likeKeyword, pagination.pageSize, pagination.offset], (listError, result) => {
          connection.release();
          if (listError) return res.status(500).json({ error: '查询重复患者失败' });
          res.json({ items: result, total: Number(countResult[0] && countResult[0].total) || 0, page: pagination.page, pageSize: pagination.pageSize });
        });
      });
      });
    }).catch(error => res.status(403).json({ error: error.message }));
  },

  getPatientMergeGroup(req, res, next) {
    const name = String(req.query.name || '').trim();
    if (!name || name.length > 50) return res.status(400).json({ error: '患者姓名无效' });
    authorizePatientMerge(req).then(tables => {
      pool.getConnection((error, connection) => {
        if (error) return res.status(500).json({ error: '数据库连接失败' });
        const sql = 'SELECT p.*, IF(p.phone IS NOT NULL AND TRIM(p.phone) <> \'\' AND TRIM(p.phone) <> \'0\' AND TRIM(p.phone) NOT REGEXP \'^0+$\', 1, 0) AS has_phone, (SELECT COUNT(*) FROM ?? o WHERE o.patient_id = p.id) AS order_count, (SELECT COUNT(*) FROM ?? g WHERE g.patient_id = p.id) AS gaofang_count, (SELECT MAX(o.date) FROM ?? o WHERE o.patient_id = p.id) AS last_visit FROM ?? p WHERE p.name = ? AND p.merge_status = \'active\' ORDER BY has_phone DESC, order_count DESC, last_visit DESC, p.id';
        connection.query(sql, [tables.order, tables.gaofang, tables.order, tables.patient, name], (queryError, result) => {
          connection.release();
          if (queryError) return res.status(500).json({ error: '查询患者组失败' });
          res.json(result);
        });
      });
    }).catch(error => res.status(403).json({ error: error.message }));
  },

  mergePatients(req, res, next) {
    const rawSourceIds = Array.isArray(req.body.sourcePatientIds) ? req.body.sourcePatientIds : [req.body.sourcePatientId];
    const sourceIds = [...new Set(rawSourceIds.map(Number))];
    const targetId = Number(req.body.targetPatientId);
    if (!sourceIds.length || sourceIds.some(id => !Number.isSafeInteger(id) || id <= 0) || !Number.isSafeInteger(targetId) || targetId <= 0 || sourceIds.includes(targetId)) {
      return res.status(400).json({ error: '合并患者标识无效' });
    }
    authorizePatientMerge(req).then(tables => {
      inTransaction(async connection => {
        const ids = [targetId, ...sourceIds].sort((a, b) => a - b);
        const placeholders = ids.map(() => '?').join(',');
        const patients = await query(connection, `SELECT * FROM ?? WHERE id IN (${placeholders}) ORDER BY id FOR UPDATE`, [tables.patient, ...ids]);
        if (patients.length !== ids.length) throw new Error('患者不存在或已被合并');
        const target = patients.find(patient => patient.id === targetId);
        const sources = patients.filter(patient => sourceIds.includes(patient.id));
        if ([target, ...sources].some(patient => patient.merge_status !== 'active')) throw new Error('只能合并有效患者');
        let movedOrders = 0;
        let movedGaofang = 0;
        for (const source of sources) {
          const orderResult = await query(connection, 'UPDATE ?? SET patient_id = ?, patient = ? WHERE patient_id = ?', [tables.order, targetId, target.name, source.id]);
          const gaofangResult = await query(connection, 'UPDATE ?? SET patient_id = ? WHERE patient_id = ?', [tables.gaofang, targetId, source.id]);
          movedOrders += orderResult.affectedRows;
          movedGaofang += gaofangResult.affectedRows;
          await query(connection, 'UPDATE ?? SET merge_status = \'merged\', merged_into_id = ?, merged_at = NOW() WHERE id = ?', [tables.patient, targetId, source.id]);
          await query(connection, 'INSERT INTO ?? (source_patient_id, target_patient_id, source_snapshot, target_snapshot, moved_orders, moved_gaofang) VALUES (?, ?, ?, ?, ?, ?)', [tables.mergeLog, source.id, targetId, JSON.stringify(source), JSON.stringify(target), orderResult.affectedRows, gaofangResult.affectedRows]);
        }
        const firstValue = (field) => target[field] || sources.map(source => source[field]).find(Boolean) || null;
        const mergedComment = [target.comment, ...sources.map(source => source.comment)].filter(Boolean).join('\\n') || null;
        await query(connection, 'UPDATE ?? SET sex = ?, age = ?, address = ?, phone = ?, wechat = ?, comment = ?, visitTimes = (SELECT COUNT(*) FROM ?? WHERE patient_id = ?) WHERE id = ?', [tables.patient, firstValue('sex'), firstValue('age'), firstValue('address'), firstValue('phone'), firstValue('wechat'), mergedComment, tables.order, targetId, targetId]);
        return { sourcePatientIds: sourceIds, targetPatientId: targetId, movedOrders, movedGaofang };
      }, res);
    }).catch(error => res.status(403).json({ error: error.message }));
  },

  savePrescription(req, res, next) {
    const prefix = req.body.dbPrefix;
    const patient = req.body.patient || {};
    const order = req.body.order || {};

    if (!patient.name || !order.medarray || !order.medtype || !order.date) {
      return res.status(400).json({ error: '处方信息不完整' });
    }

    let normalizedPhone;
    try {
      normalizedPhone = normalizePhone(patient.phone);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    let tables;
    try {
      tables = clinicTables(prefix);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    inTransaction(async connection => {
      const hasPatientId = patient.id !== null && patient.id !== undefined && patient.id !== '';
      let patientId = Number(patient.id);
      if (hasPatientId && (!Number.isSafeInteger(patientId) || patientId <= 0)) {
        throw new Error('患者标识无效');
      }

      if (hasPatientId) {
        const patients = await query(connection, 'SELECT name FROM ?? WHERE id = ? LIMIT 1', [tables.patient, patientId]);
        if (patients.length !== 1) throw new Error('患者不存在');
        if (patients[0].name !== patient.name) throw new Error('患者信息已变更，请重新选择患者后保存');

        await query(connection, 'UPDATE ?? SET sex = ?, age = ?, phone = ? WHERE id = ?', [
          tables.patient, patient.sex, patient.age, normalizedPhone, patientId,
        ]);
        const visitResult = await query(connection, 'UPDATE ?? SET visitTimes = visitTimes + 1 WHERE id = ?', [tables.patient, patientId]);
        if (visitResult.affectedRows !== 1) throw new Error('患者不存在');
      } else {
        const patientResult = await query(connection,
          'INSERT INTO ?? (name, name_pinyin, sex, age, phone) VALUES (?, ?, ?, ?, ?)',
          [tables.patient, patient.name, patient.namePinyin, patient.sex, patient.age, normalizedPhone]);
        patientId = patientResult.insertId;
      }

      const orderResult = await query(connection,
        'INSERT INTO ?? (patient, patient_id, symptom, order_comment, medtype, dose, medarray, total, totalprofit, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [tables.order, patient.name, patientId, order.symptom, order.comment, order.medtype, order.dose, order.medarray, order.total, order.totalprofit, order.date]);
      return { patientId, orderId: orderResult.insertId };
    }, res);
  },

  saveGaofangIntake(req, res, next) {
    const prefix = req.body.dbPrefix;
    const patient = req.body.patient || {};
    const record = req.body.record || {};
    if (!patient.name || !record.date) return res.status(400).json({ error: '膏方信息不完整' });

    let normalizedPhone;
    try {
      normalizedPhone = normalizePhone(patient.phone);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    let tables;
    try {
      tables = clinicTables(prefix);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    inTransaction(async connection => {
      let patientId = Number.parseInt(patient.id, 10);
      if (Number.isInteger(patientId) && patientId > 0) {
        const patients = await query(connection, 'SELECT name FROM ?? WHERE id = ? LIMIT 1', [tables.patient, patientId]);
        if (patients.length !== 1) throw new Error('患者不存在');
        if (patients[0].name !== patient.name) throw new Error('患者信息已变更，请重新选择患者后保存');
        const updateResult = await query(connection, 'UPDATE ?? SET sex = ?, age = ?, phone = ?, visitTimes = visitTimes + 1 WHERE id = ?',
          [tables.patient, patient.sex, patient.age, normalizedPhone, patientId]);
        if (updateResult.affectedRows !== 1) throw new Error('患者不存在');
      } else {
        const patientResult = await query(connection,
          'INSERT INTO ?? (name, name_pinyin, sex, age, phone) VALUES (?, ?, ?, ?, ?)',
          [tables.patient, patient.name, patient.namePinyin, patient.sex, patient.age, normalizedPhone]);
        patientId = patientResult.insertId;
      }
      const recordResult = await query(connection,
        'INSERT INTO ?? (patient_id, symptom, order_comment, date) VALUES (?, ?, ?, ?)',
        [tables.gaofang, patientId, record.symptom, record.comment, record.date]);
      return { patientId, recordId: recordResult.insertId };
    }, res);
  },
  getAllMedbyType(req, res, next) {
    console.log('api - getAllMedbyType');
    var dbs = req.query.dbs;
    var medtype = req.query.medtype;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllMedbyType;
      connection.query(sql, [dbs,medtype], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  updateMedbyId(req, res, next) {
    var dbs = req.body.dbs;
    var medname = req.body.medname,alias = req.body.alias;
    var spec = req.body.spec, medtype = req.body.medtype;
    var bagperbox = req.body.bagperbox, inventoryNm = req.body.inventoryNm;
    var baseprice = req.body.baseprice, sellprice = req.body.sellprice;
    var checked = req.body.checked, id = req.body.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateMedbyId;
      connection.query(sql, [dbs,medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  insertMed(req, res, next) {
    var dbs = req.body.dbs;
    var medname = req.body.medname,alias = req.body.alias;
    var spec = req.body.spec, medtype = req.body.medtype;
    var bagperbox = req.body.bagperbox, inventoryNm = req.body.inventoryNm;
    var baseprice = req.body.baseprice, sellprice = req.body.sellprice;
    var checked = req.body.checked;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertMed;
      connection.query(sql, [dbs,medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked], (err, result) => {
        res.json(result);
          connection.release();
      })
    })
  },

  deleteMedbyId(req, res, next) {
    var dbs = req.query.dbs;
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deleteMedbyId;
      connection.query(sql, [dbs,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  insertOrd(req, res, next) {
    console.log('api - insertOrd');
    
    var dbs = req.body.dbs;
    var patient = req.body.patient,patient_id = req.body.patient_id;
    var symptom = req.body.symptom,order_comment = req.body.order_comment;
    var medtype = req.body.medtype, dose = req.body.dose;
    var medarray = req.body.medarray, total = req.body.total;
    var totalprofit = req.body.totalprofit, date = req.body.date;
    console.log(total);
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertOrd;
      connection.query(sql, [dbs,patient,patient_id,symptom,order_comment,medtype,dose,medarray,total,totalprofit,date], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  deleteOrdbyId(req, res, next) {
    console.log('api - deleteOrdbyId');
    var dbs = req.query.dbs;
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deleteOrdbyId;
      connection.query(sql, [dbs,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getAllPatient(req, res, next) {
    console.log('api - getAllPatient');
    var dbs = req.query.dbs;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllPatient;
      connection.query(sql, [dbs], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getAllPatientNotFinished(req, res, next) {
    var dbs = req.query.dbs,isFinished = req.query.isFinished;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllPatientNotFinished;
      connection.query(sql, [dbs,isFinished], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  selectPatientByNameAndNotFinished(req, res, next) {
    console.log('api - selectPatientByNameAndNotFinished');
    var dbs = req.query.dbs, name = req.query.name;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.selectPatientByNameAndNotFinished;
      connection.query(sql, [dbs,name], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },  

  insertPatientOrderPage(req, res, next) {
    console.log('api - insertPatientOrderPage');
    var dbs = req.body.dbs;
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age;
    var phone;
    try {
      phone = normalizePhone(req.body.phone);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    var name_pinyin = req.body.name_pinyin;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertPatientOrderPage;
      connection.query(sql, [dbs,name,name_pinyin,sex,age,phone], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  updatePatientOrderPage(req, res, next) {
    console.log('api - updatePatientOrderPage');
    var dbs = req.body.dbs;
    var sex = req.body.sex;
    var age = req.body.age;
    var phone;
    try {
      phone = normalizePhone(req.body.phone);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    var id = req.body.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updatePatientOrderPage;
      connection.query(sql, [dbs,sex,age,phone,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  updatePatientTimes(req, res, next) {
    console.log('api - updatePatientTimes');
    var dbs = req.body.dbs;
    var id = req.body.patient_id;
    var change = req.body.change;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updatePatientTimes;
      connection.query(sql, [dbs,change,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  insertPatientDetailPage(req, res, next) {
    var dbs = req.body.dbs;
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age, address = req.body.address;
    var phone;
    try {
      phone = normalizePhone(req.body.phone);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    var wechat = req.body.totwechatal;
    var lastVisit = req.body.lastVisit, comment = req.body.comment;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertPatientDetailPage;
      connection.query(sql, [dbs,name,sex,age,address,phone,wechat,lastVisit,comment], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  findPatientByPinyin(req, res, next) {
    var dbs = req.query.dbs, name_pinyin = req.query.name_pinyin;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.findPatientByPinyin;
      connection.query(sql, [dbs,name_pinyin], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getPatientInfo(req, res, next) {
    var dbs = req.query.dbs;
    var id = req.query.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getPatientInfo;
      connection.query(sql, [dbs,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getTokenFromLogin(req, res, next) {
    console.log('api - getTokenFromLogin');
    var username = req.query.username,password = req.query.password;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getTokenFromLogin;
      connection.query(sql, [username,password], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getUserInfo(req, res, next) {
    console.log('api - getUserInfo');
    var token = req.query.token;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getUserInfo;
      connection.query(sql, [token], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getOrdByDate(req, res, next) {
    console.log('api - getOrdByDate');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    var dateBy = req.query.dateBy;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getOrdByDate;
      connection.query(sql, [dbs_a, dbs_b,dateBy], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  searchOrders(req, res, next) {
    let tables;
    let pagination;
    let keyword;
    try {
      tables = clinicTables(req.query.dbPrefix);
      pagination = parsePagination(req.query);
      keyword = getSearchKeyword(req.query.name);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const likeKeyword = '%' + escapeLike(keyword) + '%';
    const hideYaowan = req.query.hideYaowan === 'true' || req.query.hideYaowan === '1';
    const countSql = hideYaowan ? sqlMap.countSearchOrders : sqlMap.countSearchOrdersAll;
    const listSql = hideYaowan ? sqlMap.searchOrders : sqlMap.searchOrdersAll;
    const commonValues = [tables.order, tables.patient, likeKeyword, likeKeyword, likeKeyword];
    const countValues = hideYaowan ? commonValues.concat('药丸') : commonValues;
    const listValues = hideYaowan
      ? commonValues.concat(['药丸', pagination.pageSize, pagination.offset])
      : commonValues.concat([pagination.pageSize, pagination.offset]);

    pool.getConnection((connectionError, connection) => {
      if (connectionError) return res.status(500).json({ error: '数据库连接失败' });
      connection.query(countSql, countValues, (countError, countResult) => {
        if (countError) {
          connection.release();
          return res.status(500).json({ error: '查询处方总数失败' });
        }
        connection.query(listSql, listValues, (listError, result) => {
          connection.release();
          if (listError) return res.status(500).json({ error: '查询处方失败' });
          const total = Number(countResult[0] && countResult[0].total) || 0;
          res.json({
            items: result,
            total,
            page: pagination.page,
            pageSize: pagination.pageSize,
            hasMore: pagination.offset + result.length < total,
          });
        });
      });
    });
  },

  searchPatients(req, res, next) {
    let tables;
    let pagination;
    let keyword;
    try {
      tables = clinicTables(req.query.dbPrefix);
      pagination = parsePagination(req.query);
      keyword = getSearchKeyword(req.query.name);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const likeKeyword = '%' + escapeLike(keyword) + '%';
    const values = [tables.patient, likeKeyword, likeKeyword];
    pool.getConnection((connectionError, connection) => {
      if (connectionError) return res.status(500).json({ error: '数据库连接失败' });
      connection.query(sqlMap.countSearchPatients, values, (countError, countResult) => {
        if (countError) {
          connection.release();
          return res.status(500).json({ error: '查询患者总数失败' });
        }
        connection.query(sqlMap.searchPatients, values.concat([pagination.pageSize, pagination.offset]), (listError, result) => {
          connection.release();
          if (listError) return res.status(500).json({ error: '查询患者失败' });
          const total = Number(countResult[0] && countResult[0].total) || 0;
          res.json({
            items: result,
            total,
            page: pagination.page,
            pageSize: pagination.pageSize,
            hasMore: pagination.offset + result.length < total,
          });
        });
      });
    });
  },

  getAllOrd(req, res, next) {
    console.log('api - getAllOrd');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllOrd;
      connection.query(sql, [dbs_a, dbs_b], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getOrdBetweenDates(req, res, next) {
    console.log('api - getOrdBetweenDates');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getOrdBetweenDates;
      connection.query(sql, [dbs_a, dbs_b,startDate, endDate], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getChartInfoFromOrder(req, res, next) {
    console.log('api - getChartInfoFromOrder');
    var dbs = req.query.dbs;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getChartInfoFromOrder;
      connection.query(sql, [dbs,startDate,endDate], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getMonthlyTotals(req, res, next) {
    let tables;
    try {
      tables = clinicTables(req.query.dbPrefix);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      connection.query(sqlMap.getMonthlyTotals, [tables.order], (err, result) => {
        connection.release();
        if (err) return res.status(500).json({ error: '查询月度统计失败' });
        res.json(result);
      })
    })
  },

  saveMonthTotalToUserSetting(req, res, next) {
    console.log('api - saveMonthTotalToUserSetting');
    var id = req.body.userid;
    var colTotal = req.body.colTotal, total = req.body.lastMonthTotal;
    var colProfit = req.body.colProfit, profit = req.body.lastMonthProfit;
    console.log(id + 'pp'+colTotal + 'pp' + total)
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.saveMonthTotalToUserSetting;
      connection.query(sql, [colTotal,total,colProfit,profit,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getUserSetting(req, res, next) {
    console.log('api - getUserSetting');
    var id = req.query.userid;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getUserSetting;
      connection.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  updateUserSetting(req, res, next) {
    console.log('api - updateUserSetting');
    var displayYaowan = req.body.displayYaowan, displayProfit = req.body.displayProfit;
    var displayLessMenu = req.body.displayLessMenu, defaultDoctor = req.body.defaultDoctor;
    var userid = req.body.userid;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateUserSetting;
      connection.query(sql, [displayYaowan,displayProfit,displayLessMenu,defaultDoctor, userid], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  deletePatientbyId(req, res, next) {
    console.log('api - deletePatientbyId');
    const id = Number(req.query.patient_id);
    let tables;
    if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ error: '患者标识无效' });
    try {
      tables = clinicTables(req.query.dbPrefix || String(req.query.dbs || '').replace(/patient$/, ''));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    pool.getConnection((connectionError, connection) => {
      if (connectionError) return res.status(500).json({ error: '数据库连接失败' });
      connection.query(sqlMap.countPatientOrders, [tables.order, id], (orderError, orderResult) => {
        if (orderError) {
          connection.release();
          return res.status(500).json({ error: '检查患者关联记录失败' });
        }
        connection.query(sqlMap.countPatientGaofang, [tables.gaofang, id], (gaofangError, gaofangResult) => {
          if (gaofangError) {
            connection.release();
            return res.status(500).json({ error: '检查患者关联记录失败' });
          }
          const orderCount = Number(orderResult[0] && orderResult[0].total) || 0;
          const gaofangCount = Number(gaofangResult[0] && gaofangResult[0].total) || 0;
          connection.release();
          if (orderCount || gaofangCount) {
            return res.status(409).json({ error: '患者存在处方或膏方记录，请先合并患者或确认关联记录后再删除' });
          }
          pool.getConnection((deleteConnectionError, deleteConnection) => {
            if (deleteConnectionError) return res.status(500).json({ error: '数据库连接失败' });
            deleteConnection.query(sqlMap.deletePatientbyId, [tables.patient, id], (deleteError, result) => {
              deleteConnection.release();
              if (deleteError) return res.status(500).json({ error: '删除患者失败' });
              res.json(result);
            });
          });
        });
      });
    });
  },

  selectOrdByPatientId(req, res, next) {
    console.log('api - selectOrdByPatientId');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    var patient_id = req.query.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.selectOrdByPatientId;
      connection.query(sql, [dbs_a, dbs_b, dbs_b, patient_id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  selectOrdByPatientName(req, res, next) {
    console.log('api - selectOrdByPatientName');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    var patient_name = req.query.patient_name;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.selectOrdByPatientName;
      connection.query(sql, [dbs_a, dbs_b, patient_name], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },  

  registerPatient(req, res, next) {
    var dbs = req.body.dbs;
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age, date = req.body.date;
    var time = req.body.time
    pool.getConnection((err, connection) => {
      var sql = sqlMap.registerPatient;
      connection.query(sql, [dbs,name,sex,age,date,time], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  setPatientFinished(req, res, next) {
    console.log('api - setPatientFinished');
    var dbs = req.body.dbs; isFinished = req.body.isFinished;
    var patient_id = req.body.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.setPatientFinished;
      connection.query(sql, [dbs,isFinished, patient_id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  updateMedInventory(req, res, next){
    console.log('api - updateMedInventory');
    pool.getConnection((err, connection) => {
      var sql = req.body.sqlStatement;
      connection.query(sql, (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  createOrdAtGaofang(req, res, next) {
    console.log('api - createOrdAtGaofang')
    var dbs = req.body.dbs;
    var patient_id = req.body.patient_id;
    var symptom = req.body.symptom,order_comment = req.body.order_comment;
    var date = req.body.date;
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.createOrdAtGaofang;
      connection.query(sql, [dbs,patient_id,symptom,order_comment,date], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '创建膏方记录失败' });
        res.json(result);
      })
    })
  },

  getGaofangRecord(req, res, next) {
    console.log('api - getGaofangRecord');
    var dbs = req.query.dbs;
    var offset = Number.parseInt(req.query.offset, 10);
    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ error: '分页参数无效' });
    }
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.getGaofangRecord;
      connection.query(sql, [dbs,offset], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '读取膏方记录失败' });
        res.json(result);
      })
    })
  },
  saveGaofangRecord(req, res, next) {
    console.log('api - saveGaofangRecord')
    var dbs = req.body.dbs;
    var gaofangRecordId = req.body.gaofangRecordId;
    var gaofang_total = req.body.gaofang_total;
    var medarray = req.body.medarray;
    var status = req.body.status;
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.saveGaofangRecord;
      connection.query(sql, [dbs,medarray,gaofang_total,status,gaofangRecordId], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '保存膏方记录失败' });
        res.json(result);
      })
    })
  },
  updateGaofangStatus(req, res, next) {
    console.log('api - updateGaofangStatus')
    var dbs = req.body.dbs;
    var gaofangRecordId = req.body.gaofangRecordId;
    var status = req.body.status;
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.updateGaofangStatus;
      connection.query(sql, [dbs,status,gaofangRecordId], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '更新膏方状态失败' });
        res.json(result);
      })
    })
  },
  
  reuseGaofangRecord(req, res, next) {
    console.log('api - reuseGaofangRecord')
    var dbs = req.body.dbs;
    var patient_id = req.body.patient_id,medarray = req.body.medarray;
    var symptom = req.body.symptom,order_comment = req.body.order_comment;
    var date = req.body.date, gaofang_total = req.body.gaofang_total;
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.reuseGaofangRecord;
      connection.query(sql, [dbs,patient_id,symptom,medarray,gaofang_total,order_comment,date], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '复用膏方记录失败' });
        res.json(result);
      })
    })
  },

  loadPatientMore(req, res, next) {
    console.log('api - loadPatientMore');
    var dbs = req.query.dbs;
    var offset = Number.parseInt(req.query.offset, 10);
    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ error: '分页参数无效' });
    }
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: '数据库连接失败' });
      var sql = sqlMap.loadPatientMore;
      connection.query(sql, [dbs,offset], (queryErr, result) => {
        connection.release();
        if (queryErr) return res.status(500).json({ error: '读取患者记录失败' });
        res.json(result);
      })
    })
  },

  
}
