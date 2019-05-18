const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const pool = require('../config/database').pool;

//Get taratses
router.get('/', async function (req, res, next) {
    const data = await pool.query('SELECT * from TARATSA');
    return res.send(JSON.parse(JSON.stringify(data))).status(200)
});

//Create taratsa
router.post('/', async function (req, res, next) {
    const {token, name, description, long, lat, chef, price} = req.body;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "HOST") {
            return res.send({"message": "ROLE INVALID"}).status(200)
        }

        const result = await pool.query('insert into taratsa (name,description,`long`,lat,owner,chef,price) values (?,?,?,?,?,?,?)', [name, description, long, lat, decoded.id, chef, price]);
        res.send(
            {
                "message": "Success"
            }
        ).status(200)
    });
});

//Get taratsa based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT * from TARATSA where id = ${req.params.id}`);

    if (data.length > 0) {
        return res.send(JSON.parse(JSON.stringify(data))).status(200)
    } else {
        return res.send([]).status(200)
    }
});

//Get taratsa availability based on ID
router.get('/:id/availability/:date', async function (req, res, next) {
    const data = await pool.query(`SELECT * from RESERVATION where taratsa = ${req.params.id} and DATE(reservation_date)=DATE(?)`,req.params.date);

    if (data.length > 0) {
        return res.send(JSON.parse(JSON.stringify(data))).status(200)
    } else {
        return res.send([]).status(200)
    }
});

module.exports = router;
