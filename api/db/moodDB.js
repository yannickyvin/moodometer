const {
  Pool
} = require('pg')
const config = require('../config/config.js')

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASENAME,
  password: config.DB_PWD,
  port: config.DB_PORT
})
console.log({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASENAME,
  password: config.DB_PWD,
  port: config.DB_PORT
})

module.exports = {
  getMoodsByTeamAndMaxWeeks: (params, maxWeeks) => {
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 and day > (now() - interval '${maxWeeks} week') order by mood.day`
    return pool.query(text, params)
  },
  getMoodsByTeamsAndMaxWeeks: (teams, maxWeeks) => {
    const paramsINOperator = []
    for (let i = 1; i <= teams.length; i++) {
      paramsINOperator.push('$' + i)
    }
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team in (${paramsINOperator.join(',')}) and day > (now() - interval '${maxWeeks} week') order by mood.day`
    return pool.query(text, teams)
  },
  getMoodsByTeamsAndMaxDays: (teams, maxDays) => {
    const paramsINOperator = []
    for (let i = 1; i <= teams.length; i++) {
      paramsINOperator.push('$' + i)
    }
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team in (${paramsINOperator.join(',')}) and day > (now() - interval '${maxDays} day') order by mood.day`
    return pool.query(text, teams)
  },
  getAllMoodsByTeam: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 order by mood.day"
    return pool.query(text, params)
  },
  getAllMoodsByTeams: (teams) => {
    const paramsINOperator = []
    for (let i = 1; i <= teams.length; i++) {
      paramsINOperator.push('$' + i)
    }
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team in (${paramsINOperator.join(',')}) order by mood.day`
    return pool.query(text, teams)
  },
  getMoodsByTeamAndDay: (params) => {
    const text = "select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team=$1 and day=TO_DATE($2, 'YYYY-MM-DD')"
    return pool.query(text, params)
  },
  getMoodsByTeamsAndDay: (teams, date) => {
    const paramsINOperator = []
    for (let i = 1; i <= teams.length; i++) {
      paramsINOperator.push('$' + (i + 1))
    }
    const text = `select session, TO_CHAR(day, 'YYYY-MM-DD') as day, rate, team, information from mood where team in (${paramsINOperator.join(',')}) and day=TO_DATE($1, 'YYYY-MM-DD')`
    return pool.query(text, [date, ...teams])
  },
  insertMood: (params) => {
    const text = "insert into mood (session, day, rate, team, information) values ($1, TO_DATE($2, 'YYYY-MM-DD'), $3, $4, $5) on conflict on constraint session_day_team do update set rate=$3, information=$5"
    return pool.query(text, params)
  },
  insertTeam: (params) => {
    const text = 'insert into team (nom, publicid) values ($1, $2)'
    return pool.query(text, params)
  },
  getAllTeams: () => {
    const text = 'select nom, publicid from team'
    return pool.query(text)
  },
  getTeamByPublicId: (params) => {
    const text = 'select nom, publicid from team where publicid=$1'
    return pool.query(text, params)
  },
  deleteTeam: (params) => {
    const text = 'delete from team where publicid=$1'
    return pool.query(text, params)
  },
  getLoginAndTeam: (params) => {
    const text = `select login.email as email, login.name as username, login.social_id as socialid, login.social_token as token, 
    team.nom as teamname, team.publicid as teamid from login left join team ON login.email = team.owner where login.email=$1`
    return pool.query(text, params)
  },
  insertLogin: (params) => {
    const text = 'insert into login (email, name, social_id, social_token) values ($1, $2, $3, $4) on conflict on constraint email_unique do update set name=$2, social_id=$3, social_token=$3'
    return pool.query(text, params)
  }
}
