const express = require('express');
const router = express.Router();

const pool = require('../config/database').pool;

//Get taratses
router.get('/', async function(req, res, next) {
  const data = await pool.query('SELECT * from TARATSA');

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

//Create taratsa
router.post('/', async function(req, res, next) {
  //const data = await pool.query('INSERT TO TARATSA..');

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

//Get taratsa based on ID
router.get('/:id', async function(req, res, next) {
  const data = await pool.query(`SELECT * from TARATSA where id = ${req.params.id}`);

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

module.exports = router;
