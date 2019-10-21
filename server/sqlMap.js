var sqlMap = {
    getValue: 'SELECT * FROM test WHERE id = ?',
    setValue: 'UPDATE test SET name = ? WHERE id = ?',
    getMed: 'SELECT * FROM myDbs_medlist WHERE id = ?',
    insertMed: 'INSERT INTO myDbs_medlist(Id,name,url,alexa,country) VALUES(0,?,?,?,?)',
    updateMed: 'UPDATE myDbs_medlist SET name = ?,url = ? WHERE Id = ?',
    deleteMed: 'DELETE FROM myDbs_medlist where id=6'
  }
  
  module.exports = sqlMap;