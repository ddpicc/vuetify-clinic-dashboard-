const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');

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

module.exports = {
  savePrescription(req, res, next) {
    const prefix = req.body.dbPrefix;
    const patient = req.body.patient || {};
    const order = req.body.order || {};
    const inventoryItems = Array.isArray(req.body.inventoryItems) ? req.body.inventoryItems : [];

    if (!patient.name || !order.medarray || !order.medtype || !order.date) {
      return res.status(400).json({ error: '处方信息不完整' });
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
        await query(connection, 'UPDATE ?? SET sex = ?, age = ?, phone = ? WHERE id = ?', [
          tables.patient, patient.sex, patient.age, patient.phone, patientId,
        ]);
        const visitResult = await query(connection, 'UPDATE ?? SET visitTimes = visitTimes + 1 WHERE id = ?', [tables.patient, patientId]);
        if (visitResult.affectedRows !== 1) throw new Error('患者不存在');
      } else {
        const patientResult = await query(connection,
          'INSERT INTO ?? (name, name_pinyin, sex, age, phone) VALUES (?, ?, ?, ?, ?)',
          [tables.patient, patient.name, patient.namePinyin, patient.sex, patient.age, patient.phone]);
        patientId = patientResult.insertId;
      }

      for (const item of inventoryItems) {
        const count = Number(item.count);
        if (!item.name || !Number.isFinite(count) || count <= 0) throw new Error('库存扣减参数无效');
        const inventoryResult = await query(connection,
          'UPDATE ?? SET inventoryNm = inventoryNm - ? WHERE medname = ? AND inventoryNm >= ?',
          [tables.medicine, count, item.name, count]);
        if (inventoryResult.affectedRows !== 1) throw new Error('库存不足或药品不存在：' + item.name);
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

    let tables;
    try {
      tables = clinicTables(prefix);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    inTransaction(async connection => {
      let patientId = Number.parseInt(patient.id, 10);
      if (Number.isInteger(patientId) && patientId > 0) {
        const updateResult = await query(connection, 'UPDATE ?? SET sex = ?, age = ?, phone = ?, visitTimes = visitTimes + 1 WHERE id = ?',
          [tables.patient, patient.sex, patient.age, patient.phone, patientId]);
        if (updateResult.affectedRows !== 1) throw new Error('患者不存在');
      } else {
        const patientResult = await query(connection,
          'INSERT INTO ?? (name, name_pinyin, sex, age, phone) VALUES (?, ?, ?, ?, ?)',
          [tables.patient, patient.name, patient.namePinyin, patient.sex, patient.age, patient.phone]);
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
    var age = req.body.age, phone = req.body.phone;
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
    var age = req.body.age, phone = req.body.phone;
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
    var phone = req.body.phone, wechat = req.body.totwechatal;
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
    var dbs = req.query.dbs;
    var id = req.query.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deletePatientbyId;
      connection.query(sql, [dbs,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  selectOrdByPatientId(req, res, next) {
    console.log('api - selectOrdByPatientId');
    var dbs_a = req.query.dbs_a,dbs_b = req.query.dbs_b;
    var patient_id = req.query.patient_id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.selectOrdByPatientId;
      connection.query(sql, [dbs_a, dbs_b, patient_id], (err, result) => {
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
