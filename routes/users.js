const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pool = require('../config/database').pool;

//Get all users
router.get('/', async function (req, res, next) {
    const data = await pool.query('SELECT * from USER');
});

//Create user
router.post('/register', async function (req, res, next) {
    const {email, password, phone, role} = req.body;
    const userExist = await pool.query('select email from user where email = ?', [email]);

    if (userExist.length === 0) {
        const hashsalt = await bcrypt.hash(password, 10);
        const data = await pool.query(`insert into user(email,password,phone,role) values (?,?,?,?)`, [email, hashsalt, phone, role]);
        res.send(
            {
                "message": "Success"
            }
        ).status(200)
    } else {
        res.send(
            {
                "message": "Problem"
            }
        ).status(400)
    }
});

//Login user
router.post('/login', async function (req, res, next) {
    const {email, password} = req.body;
    const userExist = await pool.query('select email from user where email = ?', [email]);

    if (userExist.length !== 0) {
        const data = await pool.query(`select * from user where email = ?`, [email]);
        if (await bcrypt.compare(password, data[0].password)) {
            var token = jwt.sign({id: data[0].id, role: data[0].role}, process.env.JWT_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.send(
                {
                    //TODO: user info
                    "message": "Success",
                    "user_info": {
                        "id": data[0].id,
                        "email": data[0].email,
                        "phone": data[0].phone,
                        "role": data[0].role
                    },
                    "token": token
                }
            ).status(200)

        } else {
            res.send(
                {
                    "message": "Problem"
                }
            ).status(400)
        }

    } else {
        res.send(
            {
                "message": "Problem"
            }
        ).status(400)
    }

});

//Get user info based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT id,email,phone,role from user where id = ${req.params.id}`);

    if (data.length > 0) {
        if (data[0].role === "chef") {
            const chef = await pool.query(`SELECT * from menu where chef = ${req.params.id}`);
            return res.send(JSON.parse(JSON.stringify({"user_info": data, "chef": chef}))).status(200)
        } else {
            return res.send(JSON.parse(JSON.stringify({"user_info": data}))).status(200)
        }
    } else {
        return res.send([]).status(200)
    }
});

//Get user's reservations
router.get('/:id/reservations', async function (req, res, next) {
    const data = await pool.query('select * from reservation where user = ?', req.params.id);

    return res.send(JSON.parse(JSON.stringify(data))).status(200)
});

module.exports = router;
