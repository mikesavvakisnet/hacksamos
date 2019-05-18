const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const pool = require('../config/database').pool;

//Get taratses
router.get('/', async function (req, res, next) {
    const data = await pool.query('SELECT * from TARATSA');
    for(taratsa in data){
        const owner_data = await pool.query('SELECT id,email,phone,role from USER where id = ?',data[taratsa].owner);
        const chef_data = await pool.query('SELECT id,email,phone,role from USER where id = ?',data[taratsa].chef);
        data[taratsa].owner = owner_data[0]
        data[taratsa].chef = chef_data[0]
    }
    return res.status(200).send(JSON.parse(JSON.stringify(data)))
});

//Create taratsa
router.post('/', async function (req, res, next) {
    const {token, name, description, long, lat, chef, price} = req.body;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "host") {
            return res.status(200).send({"message": "ROLE INVALID"})
        }

        const result = await pool.query('insert into taratsa (name,description,`long`,lat,owner,chef,price) values (?,?,?,?,?,?,?)', [name, description, long, lat, decoded.id, chef, price]);
        res.status(200).send(
            {
                "message": "Success"
            }
        )
    });
});

//Get taratsa based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT * from TARATSA where id = ${req.params.id}`);

    if (data.length > 0) {
        return res.status(200).send(JSON.parse(JSON.stringify(data)))
    } else {
        return res.status(200).send([])
    }
});

//Get taratsa availability based on ID and Date
// frontend: date = new Date().toISOString().slice(0, 19).replace('T', ' ');
router.get('/:id/availability/:date', async function (req, res, next) {
    const data = await pool.query(`SELECT * from RESERVATION where taratsa = ${req.params.id} and DATE(reservation_date)=DATE(?)`,req.params.date);

    if (data.length > 0) {
        return res.status(200).send(JSON.parse(JSON.stringify(data)))
    } else {
        return res.status(200).send([])
    }
});

module.exports = router;
