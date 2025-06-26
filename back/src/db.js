const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
<<<<<<< HEAD
  password: 'root',
  database: 'tu_db',
=======
  password: 'Zer0tru$tsql',
  database: 'colosus_db',
>>>>>>> 28c24e7ecc5b737dbdf58685d4934ac5db4e9bad
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // Cambiado de export default
