var sqlMap = {
    getValue: 'SELECT * FROM test WHERE id = ?',
    setValue: 'UPDATE test SET name = ? WHERE id = ?',
    getAllMedbyType: 'SELECT * FROM myDbs_medlist WHERE medtype = ?',
    insertMed: 'INSERT INTO myDbs_medlist(Id,name,url,alexa,country) VALUES(0,?,?,?,?)',
    updateMed: 'UPDATE myDbs_medlist SET name = ?,url = ? WHERE Id = ?',
    deleteMed: 'DELETE FROM myDbs_medlist where id=6',
    getAllOrd: 'SELECT * FROM myDbs_ordlist'
  }
  
  module.exports = sqlMap;