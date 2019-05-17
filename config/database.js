const mysql = require('mysql');
const util = require('util');

const pool  = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.MYSQL_HOST,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

pool.query = util.promisify(pool.query)

module.exports = {
    'host' : process.env.MYSQL_HOST,
    'database' : process.env.MYSQL_DATABASE,
    'user' : process.env.MYSQL_USER,
    'password' : process.env.MYSQL_PASSWORD,
    pool
};