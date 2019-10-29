var sqlMap = {
    getValue: 'SELECT * FROM test WHERE id = ?',
    setValue: 'UPDATE test SET name = ? WHERE id = ?',
    getAllMedbyType: 'SELECT * FROM myDbs_medlist WHERE medtype = ?',
    insertMed: 'INSERT INTO myDbs_medlist(Id,name,url,alexa,country) VALUES(0,?,?,?,?)',
    updateMedbyId: 'UPDATE myDbs_medlist SET medname = ?,alias = ?,spec = ?,medtype = ?,bagperbox = ?,inventoryNm = ?,baseprice = ?,sellprice = ?,checked = ? WHERE Id = ?',
    deleteMed: 'DELETE FROM myDbs_medlist where id=6',
    getAllOrd: 'SELECT * FROM myDbs_ordlist'
  }
  
  module.exports = sqlMap;