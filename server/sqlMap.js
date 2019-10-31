var sqlMap = {
    getAllMedbyType: 'SELECT * FROM myDbs_medlist WHERE medtype = ?',
    insertMed: 'INSERT INTO myDbs_medlist(medname,alias,spec,medtype,bagperbox,inventoryNm,baseprice,sellprice,checked) VALUES(?,?,?,?,?,?,?,?,?)',
    updateMedbyId: 'UPDATE myDbs_medlist SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE Id = ?',
    deleteMed: 'DELETE FROM myDbs_medlist where id=?',
    getAllOrd: 'SELECT * FROM myDbs_ordlist',
    getAllPatient: 'SELECT * FROM myDbs_patient'
  }
  
  module.exports = sqlMap;