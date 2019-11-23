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
console.log({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASENAME,
  password: config.DB_PWD,
  port: config.DB_PORT,
})

module.exports = {
  getMoodsByTeamAndMaxWeeks: (params, maxWeeks) => {
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 and day > (now() - interval '${maxWeeks} week') order by mood.day`;
    return pool.query(text, params);
  },
  getAllMoodsByTeam: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 order by mood.day";
    return pool.query(text, params);
  },
  getMoodsByTeamAndDay: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 and day=TO_DATE($2, 'YYYY-MM-DD')";
    return pool.query(text, params);
  },
  insertMood: (params) => {
    const text = "insert into mood (session, day, rate, team, information) values ($1, TO_DATE($2, 'YYYY-MM-DD'), $3, $4, $5) on conflict on constraint session_day_team do update set rate=$3, information=$5";
    return pool.query(text, params);
  }
};
