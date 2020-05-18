var sqlMap = {
    getAllMedbyType: 'SELECT * FROM ?? WHERE medtype = ?',
    insertMed: 'INSERT INTO ?? (medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked) VALUES(?,?,?,?,?,?,?,?,?)',
    updateMedbyId: 'UPDATE ?? SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE id = ?',
    deleteMedbyId: 'DELETE FROM ?? where id=?',
    insertOrd: 'INSERT INTO ?? (patient,patient_id,symptom,order_comment,medtype,dose,medarray,total,totalprofit,date) VALUES(?,?,?,?,?,?,?,?,?,?)',
    deleteOrdbyId: 'DELETE FROM ?? where id=?',
    getAllPatient: 'SELECT * FROM ??',
    insertPatientOrderPage: 'INSERT INTO ??(name,name_pinyin,sex,age,phone,lastVisit) VALUES(?,?,?,?,?,?)',
    insertPatientDetailPage: 'INSERT INTO ??(name,sex,age,address,phone,wechat,lastVisit,comment) VALUES(?,?,?,?,?,?,?,?)',
    findPatientByPinyin: 'SELECT * FROM ?? WHERE name_pinyin like ?',
    getPatientInfo: 'SELECT * FROM ?? WHERE id = ?',
    getTokenFromLogin: 'SELECT token FROM myDbs_user WHERE username = ? and password = ?',
    getUserInfo: 'SELECT * FROM myDbs_user WHERE token = ?',
    getUserSetting: 'SELECT * FROM myDbs_userconfig WHERE userid = ?',
    saveMonthTotalToUserSetting: 'UPDATE myDbs_userconfig SET ?? = ? WHERE userid = ?',
    getChartInfoFromOrder: 'SELECT total,totalprofit,date from ?? where date between ? and ?',
    getOrdByDate: 'SELECT a.id,a.patient,a.medtype,a.symptom,a.order_comment,a.dose,a.medarray,a.total,a.totalprofit,a.date,b.sex,b.age,b.phone FROM ?? a INNER JOIN ?? b ON a.patient_id = b.id where date = ? order by id desc',
    getAllOrd: 'SELECT a.id,a.patient,a.medtype,a.symptom,a.order_comment,a.dose,a.medarray,a.total,a.totalprofit,a.date,b.sex,b.age,b.phone FROM ?? a INNER JOIN ?? b ON a.patient_id = b.id order by id desc',
    getOrdBetweenDates: 'SELECT a.id,a.patient,a.medtype,a.symptom,a.order_comment,a.dose,a.medarray,a.total,a.totalprofit,a.date,b.sex,b.age,b.phone FROM ?? a INNER JOIN ?? b ON a.patient_id = b.id where date between ? and ? order by id desc',
    loadUserConfig: 'SELECT * FROM myDbs_userconfig WHERE userid = ?',
  }
  
  module.exports = sqlMap;