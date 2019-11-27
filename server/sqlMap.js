var sqlMap = {
    getAllMedbyType: 'SELECT * FROM ?? WHERE medtype = ?',
    insertMed: 'INSERT INTO ?? (medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked) VALUES(?,?,?,?,?,?,?,?,?)',
    updateMedbyId: 'UPDATE ?? SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE Id = ?',
    deleteMedbyId: 'DELETE FROM ?? where id=?',
    getAllOrd: 'SELECT * FROM ??',
    insertOrd: 'INSERT INTO ??(patient,patient_id,medtype,dose,medarray,total,date) VALUES(?,?,?,?,?,?,?)',
    deleteOrdbyId: 'DELETE FROM ?? where id=?',
    getAllPatient: 'SELECT * FROM ??',
    insertPatientOrderPage: 'INSERT INTO ??(name,sex,age,phone,lastVisit) VALUES(?,?,?,?,?)',
    insertPatientDetailPage: 'INSERT INTO ??(name,sex,age,address,phone,wechat,lastVisit,comment) VALUES(?,?,?,?,?,?,?,?)',
    getTokenFromLogin: 'SELECT token FROM myDbs_user WHERE username = ? and password = ?',
    getUserInfo: 'SELECT * FROM myDbs_user WHERE token = ?',
  }
  
  module.exports = sqlMap;