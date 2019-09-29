const {
  Pool,
} = require('pg');
const config = require('../config/config.js');

const pool = new Pool({
  user: config.DB_USER,
  host: config. DB_HOST,
  database: config.DB_DATABASENAME,
  password: config.DB_PWD,
  port: config.DB_PORT,
});

module.exports = {
  getAllMoods: (params) => {
    const text = "select session, TO_CHAR(day, 'DD-MM-YYYY') as day, rate from mood order by mood.day";
    return pool.query(text, params);
  },
  getMoodsByDate: (params) => {
    const text = "select session, TO_CHAR(day, 'DD-MM-YYYY') as day, rate from mood where day=TO_DATE($1, 'DD-MM-YYYY')";
    return pool.query(text, params);
  },
  updateMood: (params) => {
    const text = 'update mood set day=$2, rate=$3 from mood where session=$1';
    return pool.query(text, params);
  },
  insertMood: (params) => {
    const text = "insert into mood (session, day, rate) values ($1, TO_DATE($2, 'DD-MM-YYYY'), $3) on conflict on constraint session_day do update set rate=$3";
    return pool.query(text, params);
  }
};
