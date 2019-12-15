const express = require('express')
const router = express.Router()
const db = require('../db/moodDB.js')
const config = require('../config/config.js')

router.get('/', async function (req, res, next) {
  const date = req.query.date
  const team = ((req.query.team === undefined) || (req.query.team === '')) ? config.DEFAULT_TEAM : req.query.team
  const maxWeeks = ((req.query.maxweeks === undefined) || (req.query.maxweeks === '')) ? 1 : req.query.maxweeks
  let moods
  if ((req.query.date !== undefined) && (req.query.date !== '')) {
    moods = await db.getMoodsByTeamAndDay([team, date])
  } else if ((req.query.maxweeks !== undefined) && (req.query.maxweeks !== '')) {
    moods = await db.getMoodsByTeamAndMaxWeeks([team], maxWeeks)
  } else {
    moods = await db.getAllMoodsByTeam([team])
  }

  res.jsonp(moods.rows)
})

router.post('/', async function (req, res) {
  const session = req.body.session
  const day = req.body.day
  const rate = req.body.rate
  const information = req.body.information
  const team = (req.body.team === undefined || req.body.team === 'undefined') ? config.DEFAULT_TEAM : req.body.team
  try {
    await db.insertMood([session, day, rate, team, information])
    res.status(201).jsonp({ success: ' créé' })
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
