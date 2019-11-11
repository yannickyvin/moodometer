const express = require('express');
const router = express.Router();
const db = require('../db/moodDB.js');
const config = require('../config/config.js');

router.get('/', async function (req, res, next) {
  console.log('mood get');

  const date = req.query.date;
  let team = ((req.query.team === undefined) || (req.query.team === "")) ? config.DEFAULT_TEAM : req.query.team;
  let moods;
  if ((req.query.date !== undefined) && (req.query.date !== '')) {
    console.log('date', date);
    moods = await db.getMoodsByDateAndTeam([date, team]);
  } else {
    moods = await db.getAllMoodsByTeam([team]);
  }

  res.jsonp(moods.rows);
})

router.post('/', async function(req, res) {
  console.log('mood post /', req.body);

  const session = req.body.session;
  const day = req.body.day;
  const rate = req.body.rate;
  const information = req.body.information
  const team = (req.body.team === undefined ||  req.body.team === 'undefined') ? config.DEFAULT_TEAM : req.body.team;
  console.log("params", session, day, rate, team, information);
  try {
    await db.insertMood([session, day, rate, team, information]);
    res.status(201).jsonp({success : ' créé'});
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;
