const express = require('express');
const router = express.Router();

const pool = require('../config/database').pool;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await pool.query('SELECT * from user');

  res.send(JSON.parse(JSON.stringify(data))).status(200)

});

module.exports = router;
