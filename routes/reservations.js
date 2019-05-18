const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pool = require('../config/database').pool;

//Create reservation
router.post('/', async function (req, res, next) {
    const {token, taratsa, reservation_date, notes} = req.body;

    //TODO: PAYMENT STATUS
    const payment_status = "PENDING"

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "USER") {
            return res.send({"message": "ROLE INVALID"}).status(200)
        }

        const result = await pool.query('insert into reservation (user,taratsa,reservation_date,notes,payment_status) values (?,?,?,?,?)', [decoded.id, taratsa, reservation_date, notes, payment_status]);
        res.send(
            {
                "message": "Success"
            }
        ).status(200)
    });
});

//Get reservation based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT * from RESERVATION where id = ${req.params.id}`);

    return res.send(JSON.parse(JSON.stringify(data))).status(200)

});

module.exports = router;
