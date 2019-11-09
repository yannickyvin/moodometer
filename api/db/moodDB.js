const {
  Pool,
} = require('pg');
const config = require('../config/config.js');

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASENAME,
  password: config.DB_PWD,
  port: config.DB_PORT,
});

module.exports = {
  getAllMoodsByTeam: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team from mood where team=$1 order by mood.day";
    return pool.query(text, params);
  },
  getMoodsByDateAndTeam: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team from mood where team=$2 and day=TO_DATE($1, 'YYYY-MM-DD')";
    return pool.query(text, params);
  },
  insertMood: (params) => {
    const text = "insert into mood (session, day, rate, team) values ($1, TO_DATE($2, 'YYYY-MM-DD'), $3, $4) on conflict on constraint session_day_team do update set rate=$3";
    return pool.query(text, params);
  }
};
