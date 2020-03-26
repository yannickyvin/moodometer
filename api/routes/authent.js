const express = require('express')
const router = express.Router()
const { generateToken, sendToken } = require('../utils/token.utils')
const passport = require('passport')
require('../passport')()

/*
router.post('/google',
  passport.authenticate('google-token', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated')
    }
    req.auth = {
      id: req.user.id
    }
    next()
  }, generateToken, sendToken
) */

router.route('/google')
  .post(passport.authenticate('google-token', { session: false }), function (req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated')
    }
    req.auth = {
      id: req.user.id
    }

    next()
  }, generateToken, sendToken)

module.exports = router
