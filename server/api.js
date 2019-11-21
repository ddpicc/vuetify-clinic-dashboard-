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
    var medname = req.body.medname,alias = req.body.alias;
    var spec = req.body.spec, medtype = req.body.medtype;
    var bagperbox = req.body.bagperbox, inventoryNm = req.body.inventoryNm;
    var baseprice = req.body.baseprice, sellprice = req.body.sellprice;
    var checked = req.body.checked, id = req.body.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateMedbyId;
      connection.query(sql, [medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked,id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  insertMed(req, res, next) {
    var medname = req.body.medname,alias = req.body.alias;
    var spec = req.body.spec, medtype = req.body.medtype;
    var bagperbox = req.body.bagperbox, inventoryNm = req.body.inventoryNm;
    var baseprice = req.body.baseprice, sellprice = req.body.sellprice;
    var checked = req.body.checked;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertMed;
      connection.query(sql, [medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked], (err, result) => {
        res.json(result);
          connection.release();
      })
    })
  },

  deleteMedbyId(req, res, next) {
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deleteMedbyId;
      connection.query(sql, [id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getAllOrd(req, res, next) {
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllOrd;
      connection.query(sql, [], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  insertOrd(req, res, next) {
    var patient = req.body.patient,patient_id = req.body.patient_id;
    var medtype = req.body.medtype, dose = req.body.dose;
    var medarray = req.body.medarray, total = req.body.total;
    var date = req.body.date;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertOrd;
      connection.query(sql, [patient,patient_id,medtype,dose,medarray,total,date], (err, result) => {
        console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  getAllPatient(req, res, next) {
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllPatient;
      connection.query(sql, [], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  insertPatientOrderPage(req, res, next) {
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age, phone = req.body.phone;
    var lastVisit = req.body.lastVisit;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertPatientOrderPage;
      connection.query(sql, [name,sex,age,phone,lastVisit], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  insertPatientDetailPage(req, res, next) {
    var name = req.body.name,sex = req.body.sex;
    var age = req.body.age, address = req.body.address;
    var phone = req.body.phone, wechat = req.body.totwechatal;
    var lastVisit = req.body.lastVisit, comment = req.body.comment;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.insertPatientDetailPage;
      connection.query(sql, [name,sex,age,address,phone,wechat,lastVisit,comment], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getTokenFromLogin(req, res, next) {
    var username = req.query.username,password = req.query.password;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getTokenFromLogin;
      connection.query(sql, [username,password], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  
}
