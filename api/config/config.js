const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  DB_HOST : process.env.DB_HOST,
  DB_DATABASENAME : process.env.DB_DATABASENAME,
  DB_USER : process.env.DB_USER,
  DB_PWD : process.env.DB_PWD,
  DB_PORT : process.env.DB_PORT,
  DEFAULT_TEAM: process.env.DEFAULT_TEAM
}
