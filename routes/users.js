var express = require('express');
var router = express.Router();

//Get all users
router.get('/', async function(req, res, next) {
  const data = await pool.query('SELECT * from USER');

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

//Create user
router.post('/', async function(req, res, next) {
  //const data = await pool.query('INSERT TO USERS..');

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

module.exports = router;
