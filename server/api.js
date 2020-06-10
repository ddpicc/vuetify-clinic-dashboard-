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

module.exports = {
  getAllMedbyType(req, res, next) {
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
    console.log(id);
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deleteOrdbyId;
      connection.query(sql, [dbs,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getAllPatient(req, res, next) {
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
    var dbs = req.body.dbs;
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age, phone = req.body.phone;
    var lastVisit = req.body.lastVisit, name_pinyin = req.body.name_pinyin
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertPatientOrderPage;
      connection.query(sql, [dbs,name,name_pinyin,sex,age,phone,lastVisit], (err, result) => {
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
    var col = req.body.col,data = req.body.lastMonthTotal;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.saveMonthTotalToUserSetting;
      connection.query(sql, [col,data,id], (err, result) => {
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
    var userid = req.body.userid;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateUserSetting;
      connection.query(sql, [displayYaowan,displayProfit, userid], (err, result) => {
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

  

  
}
