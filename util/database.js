const mysql = require("mysql2");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_course',
    password: 'root'
});

module.exports = pool.promise();