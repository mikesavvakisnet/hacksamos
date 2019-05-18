const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');

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

    if(data.length > 0){
        return res.send(JSON.parse(JSON.stringify(data))).status(200)
    }else{
        return res.send({"message":"No found"}).status(200)
    }
});

module.exports = router;
