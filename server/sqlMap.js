var sqlMap = {
    getAllMedbyType: 'SELECT * FROM ?? WHERE medtype = ?',
    insertMed: 'INSERT INTO ?? (medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked) VALUES(?,?,?,?,?,?,?,?,?)',
    updateMedbyId: 'UPDATE ?? SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE Id = ?',
    deleteMedbyId: 'DELETE FROM ?? where id=?',
    getAllOrd: 'SELECT a.id,a.patient,a.medtype,a.symptom,a.order_comment,a.dose,a.medarray,a.total,a.totalprofit,a.date,b.sex,b.age,b.phone FROM ?? a INNER JOIN ?? b ON a.patient_id = b.id',
    insertOrd: 'INSERT INTO ?? (patient,patient_id,symptom,order_comment,medtype,dose,medarray,total,date) VALUES(?,?,?,?,?,?,?,?,?)',
    deleteOrdbyId: 'DELETE FROM ?? where id=?',
    getAllPatient: 'SELECT * FROM ??',
    insertPatientOrderPage: 'INSERT INTO ??(name,name_pinyin,sex,age,phone,lastVisit) VALUES(?,?,?,?,?,?)',
    insertPatientDetailPage: 'INSERT INTO ??(name,sex,age,address,phone,wechat,lastVisit,comment) VALUES(?,?,?,?,?,?,?,?)',
    findPatientByPinyin: 'SELECT * FROM ?? WHERE name_pinyin like ?',
    getPatientInfo: 'SELECT * FROM ?? WHERE id = ?',
    getTokenFromLogin: 'SELECT token FROM myDbs_user WHERE username = ? and password = ?',
    getUserInfo: 'SELECT * FROM myDbs_user WHERE token = ?',
    getLast30Days: 'SELECT total,date from ?? where date between ? and ?',
  }
  
  module.exports = sqlMap;