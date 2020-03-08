'use strict'

const passport = require('passport')
const GoogleTokenStrategy = require('passport-google-token').Strategy
const config = require('./config/config')
const mood = require('./db/moodDB')

const recordUser = async (accessToken, refreshToken, profile, cb) => {
  console.log('recordUser', accessToken, refreshToken, profile)
  let loginObj = {}
  try {
    const res = await mood.getLoginAndTeam([profile.emails[0].value])
    if (res.rows.length === 0) {
      await mood.insertLogin([profile.emails[0].value, profile.displayName, profile.id, accessToken])
      loginObj = {
        fullName: profile.displayName,
        email: profile.emails[0].value,
        googleProvider: {
          id: profile.id,
          token: accessToken
        }
      }
    } else {
      loginObj = {
        fullName: res.rows[0].username,
        email: res.rows[0].email,
        googleProvider: {
          id: profile.id,
          token: accessToken
        },
        teamname: res.rows[0].teamname,
        teamid: res.rows[0].teamid
      }
    }

    console.log('loginObj', loginObj)
    return cb(undefined, loginObj)
  } catch (e) {
    return cb(e, {})
  }
}

module.exports = () => {
  passport.use(new GoogleTokenStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret
  },
  (accessToken, refreshToken, profile, done) => {
    recordUser(accessToken, refreshToken, profile, (err, user) => {
      return done(err, user)
    })
  }))
}
