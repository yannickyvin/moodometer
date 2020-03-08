const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_DATABASENAME: process.env.DB_DATABASENAME,
  DB_USER: process.env.DB_USER,
  DB_PWD: process.env.DB_PWD,
  DB_PORT: process.env.DB_PORT,
  DEFAULT_TEAM: process.env.DEFAULT_TEAM,
  googleAuth: {
    clientID: '749885885691-mbmq26ndov6bnlmj2e9jmev83h8ieqjt.apps.googleusercontent.com',
    clientSecret: 'tA86r9l8gQpzpAC_bzy9EuEH',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }
}
