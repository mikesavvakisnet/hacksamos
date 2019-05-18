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
    const {firstname, lastname, email, password, phone, role} = req.body;
    const userExist = await pool.query('select email from user where email = ?', [email]);

    if (userExist.length === 0) {
        const hashsalt = await bcrypt.hash(password, 10);
        const data = await pool.query(`insert into user(firstname,lastname,email,password,phone,role) values (?,?,?,?,?,?)`, [firstname, lastname, email, hashsalt, phone, role]);
        res.status(200).send(
            {
                "message": "Success"
            }
        )
    } else {
        res.status(401).send(
            {
                "message": "Problem"
            }
        )
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
                expiresIn: 86401 // expires in 24 hours
            });
            res.status(200).send(
                {
                    "message": "Success",
                    "user_info": {
                        "id": data[0].id,
                        "firstname": data[0].firstname,
                        "lastname": data[0].lastname,
                        "email": data[0].email,
                        "phone": data[0].phone,
                        "role": data[0].role
                    },
                    "token": token
                }
            )

        } else {
            res.status(401).send(
                {
                    "message": "Problem"
                }
            )
        }

    } else {
        res.status(401).send(
            {
                "message": "Problem"
            }
        )
    }

});

//Get user info based on ID
router.get('/:id', async function (req, res, next) {
    const data = await pool.query(`SELECT id,firstname,lastname,email,phone,role from user where id = ${req.params.id}`);

    if (data.length > 0) {
        if (data[0].role === "chef") {
            const chef = await pool.query(`SELECT * from menu where chef = ${req.params.id}`);
            return res.status(200).send(JSON.parse(JSON.stringify({"user_info": data, "chef": chef})))
        } else {
            return res.status(200).send(JSON.parse(JSON.stringify({"user_info": data})))
        }
    } else {
        return res.status(200).send([])
    }
});

//Get user info based on ID
router.get('/chefs', async function (req, res, next) {
    const data = await pool.query(`SELECT id,firstname,lastname,email,phone,role from user where role = 'chef`);

    return res.status(200).send(JSON.parse(JSON.stringify({"user_info": data})))
});

//Get user's reservations
router.get('/:id/reservations', async function (req, res, next) {
    const data = await pool.query('select * from reservation where user = ?', req.params.id);

    return res.status(200).send(JSON.parse(JSON.stringify(data)))
});

module.exports = router;
