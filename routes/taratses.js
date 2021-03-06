const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const pool = require('../config/database').pool;

//Get taratses
router.get('/', async function (req, res, next) {
    const data = await pool.query('SELECT * from TARATSA');

    for (taratsa in data) {
        const owner_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[taratsa].owner);
        const chef_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[taratsa].chef);
        const chef_menu = await pool.query('SELECT menu from MENU where chef = ?', chef_data[0].id);
        data[taratsa].owner = owner_data[0];
        data[taratsa].chef = chef_data[0];
        data[taratsa].menu = chef_menu[0];
    }
    return res.status(200).send(JSON.parse(JSON.stringify(data)))
});

//Create taratsa
router.post('/', async function (req, res, next) {
    const {token, name, description, long, lat, chef, price} = req.body;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        if (decoded.role !== "host") {
            return res.status(401).send({"message": "ROLE INVALID"})
        }

        const result = await pool.query('insert into taratsa (name,description,`long`,lat,owner,chef,price) values (?,?,?,?,?,?,?)', [name, description, long, lat, decoded.id, chef, price]);
        const data = await pool.query('SELECT * from TARATSA where id = ?', result.insertId);
        const owner_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[0].owner);
        const chef_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[0].chef);
        data[0].owner = owner_data[0];
        data[0].chef = chef_data[0];
        res.status(200).send(JSON.parse(JSON.stringify(data[0])))
    });
});

//Get taratsa based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT * from TARATSA where id = ${req.params.id}`);


    if (data.length > 0) {
        const owner_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[0].owner);
        const chef_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[0].chef);
        const chef_menu = await pool.query('SELECT menu from MENU where chef = ?', chef_data[0].id);

        data[0].owner = owner_data[0];
        data[0].chef = chef_data[0];
        data[0].menu = chef_menu[0];
        return res.status(200).send(JSON.parse(JSON.stringify(data[0])))
    } else {
        return res.status(200).send([])
    }
});

//Get taratsa availability based on ID and Date
// frontend: date = new Date().toISOString().slice(0, 19).replace('T', ' ');
router.get('/date/:date', async function (req, res, next) {
    console.log(req.params.date);
    const data = await pool.query(`SELECT * from taratsa where id not in (select id from reservation where DATE(reservation_date) = DATE(?))`, req.params.date);

    if (data.length > 0) {
        for (taratsa in data) {
            const owner_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[taratsa].owner);
            const chef_data = await pool.query('SELECT id,firstname,lastname,email,phone,role from USER where id = ?', data[taratsa].chef);
            const chef_menu = await pool.query('SELECT menu from MENU where chef = ?', chef_data[0].id);
            data[taratsa].owner = owner_data[0];
            data[taratsa].chef = chef_data[0];
            data[taratsa].menu = chef_menu[0];
        }
        return res.status(200).send(JSON.parse(JSON.stringify(data)))
    } else {
        return res.status(200).send([])
    }
});

module.exports = router;
