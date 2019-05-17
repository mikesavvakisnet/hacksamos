const express = require('express');
const router = express.Router();

const pool = require('../config/database').pool;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await pool.query('SELECT NOW() as time_test');

  res.render('index', { title: data[0].time_test });


});

module.exports = router;
