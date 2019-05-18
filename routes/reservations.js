const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const pool = require('../config/database').pool;

const paypal = require('paypal-rest-sdk');


//Create reservation
router.post('/', async function (req, res, next) {
    const {token, taratsa, reservation_date, notes} = req.body;

    //TODO: PAYMENT STATUS
    const payment_status = "PENDING";

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "user") {
            return res.status(200).send({"message": "ROLE INVALID"})
        }

        const result = await pool.query('insert into reservation (user,taratsa,reservation_date,notes,payment_status) values (?,?,?,?,?)', [decoded.id, taratsa, reservation_date, notes, payment_status]);
        res.status(200).send(
            {
                "message": "Success",
                "reservation_id": result.insertId
            }
        )
    });
});

//Big security hole :(
//Update payment status reservation
router.post('/:id/updatePaymentStatus', async function (req, res, next) {
    const {token, payment_status} = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "user") {
            return res.status(200).send({"message": "ROLE INVALID"})
        }

        const result = await pool.query('update reservation set payment_status = ? where id = ?', [payment_status, req.params.id]);
        res.status(200).send(
            {
                "message": "Success"
            }
        )
    });
});


//Get reservation based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT * from RESERVATION where id = ${req.params.id}`);

    return res.status(200).send(JSON.parse(JSON.stringify(data)))

});


module.exports = router;
