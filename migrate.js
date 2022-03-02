require('dotenv').config();

const fs = require('fs');
const mysql = require('mysql2/promise');

const migrate = async () => {
  const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createPool({
    host: 'http://srv-captain--database-db',
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  await connection.query(`drop database if exists ${DB_NAME}`);
  await connection.query(`create database ${DB_NAME}`);
  await connection.query(`use ${DB_NAME}`);

  const sql = fs.readFileSync('./database.sql', 'utf8');

  await connection.query(sql);

  connection.end();
};

try {
  migrate();
} catch (err) {
  console.log(err);
}
