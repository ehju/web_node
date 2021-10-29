const mysql = require('mysql');
const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
  dateStrings : 'date'
});

db.connect();
module.exports = db;