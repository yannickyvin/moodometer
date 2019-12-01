const express = require('express');
const moodsRouter = require('./routes/mood');
const teamsRouter = require('./routes/team');

const app = express();

const port = 8400;
app.listen(port, () => {
  console.log('Démarrage sur le port', port);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
  next();
});

app.use(express.json()); // for parsing application/json
app.use('/moods', moodsRouter);
app.use('/teams', teamsRouter);

