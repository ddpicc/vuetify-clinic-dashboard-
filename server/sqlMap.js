var sqlMap = {
    getAllMedbyType: 'SELECT * FROM myDbs_medlist WHERE medtype = ?',
    insertMed: 'INSERT INTO myDbs_medlist(medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked) VALUES(?,?,?,?,?,?,?,?,?)',
    updateMedbyId: 'UPDATE myDbs_medlist SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE Id = ?',
    deleteMedbyId: 'DELETE FROM myDbs_medlist where id=?',
    getAllOrd: 'SELECT * FROM myDbs_ordlist',
    insertOrd: 'INSERT INTO myDbs_ordlist(patient,patient_id,medtype,dose,medarray,total,date) VALUES(?,?,?,?,?,?,?)',
    getAllPatient: 'SELECT * FROM myDbs_patient',
    insertPatientOrderPage: 'INSERT INTO myDbs_patient(name,sex,age,phone,lastVisit) VALUES(?,?,?,?,?)',
    insertPatientDetailPage: 'INSERT INTO myDbs_patient(name,sex,age,address,phone,wechat,lastVisit,comment) VALUES(?,?,?,?,?,?,?,?)',
    getTokenFromLogin: 'SELECT token FROM myDbs_user WHERE username = ? and password = ?',
  }
  
  module.exports = sqlMap;