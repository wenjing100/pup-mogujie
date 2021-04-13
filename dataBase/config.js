const mysql = require('mysql')

const HOST ='47.110.38.241';//47.110.38.241
const USER= 'root';
const PASSWORD= 'wenjing100aa';
const DATABASE= 'wenjing_01';//wenjing_01
const PORT = 3306;

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port:PORT
});
connection.connect();

module.exports = connection;