const express = require('express');
const router = express.Router();
const db = require('../db/moodDB.js');

router.get('/', async function (req, res, next) {
  console.log('mood get');

  const date = req.query.date;
  let moods;
  if ((req.query.date !== undefined) && (req.query.date !== '')) {
    console.log('date', date);
    moods = await db.getMoodsByDate([date]);
  } else {
    moods = await db.getAllMoods();
  }

  res.jsonp(moods.rows);
})

router.post('/', async function(req, res) {
  console.log('mood post /', req.body);

  const session = req.body.session;
  const day = req.body.day;
  const rate = req.body.rate;
  console.log("params", session, day, rate);
  try {
    const response = await db.insertMood([session, day, rate]);
    res.status(201).jsonp({success : ' créé'});
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;
