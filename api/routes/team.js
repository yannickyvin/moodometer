const express = require('express');
const router = express.Router();
const db = require('../db/moodDB.js');
const config = require('../config/config.js');

router.get('/', async function (req, res, next) {
  const publicid = req.query.publicid;

  if (publicid === undefined) {
    let teams;
    teams = await db.getAllTeams();
  
    res.jsonp(teams.rows);
  } else {
    let team;
    team = await db.getTeamByPublicId([publicid]);
  
    res.jsonp(team.rows);
  }
})

router.post('/', async function(req, res) {
  const nom = req.body.nom;
  const publicid = req.body.publicid;
  try {
    await db.insertTeam([nom, publicid]);
    res.status(201).jsonp({success : ' créé'});
  } catch (e) {
    console.error(e);
  }
})

router.delete('/', async function(req, res) {
  const publicid = req.query.publicid;
  try {
    await db.deleteTeam([publicid]);
    res.status(201).jsonp({success : ' supprimé'});
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;
