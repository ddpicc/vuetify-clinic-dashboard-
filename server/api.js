const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  multipleStatements: true    // 多语句查询
});

module.exports = {
  getAllMedbyType(req, res, next) {
    var medtype = req.query.medtype;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllMedbyType;
      connection.query(sql, [medtype], (err, result) => {
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

  getAllOrd(req, res, next) {
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getAllOrd;
      connection.query(sql, [], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  
}
