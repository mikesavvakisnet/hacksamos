const express = require('express');
const router = express.Router();

const pool = require('../config/database').pool;

//Get user's reservations
router.post('/', async function(req, res, next) {
    //const data = await pool.query('SELECT FROM RESERVATION..');
  
    res.send(data).status(200)
  
  });

//Create reservation
router.post('/', async function(req, res, next) {
  //const data = await pool.query('INSERT TO RESERVATION..');

  res.send(data).status(200)

});

//Get reservation based on ID
router.get('/:id', async function(req, res, next) {
  const data = await pool.query(`SELECT * from RESERVATION where id = ${req.params.id}`);

  res.send(data).status(200)

});

module.exports = router;
