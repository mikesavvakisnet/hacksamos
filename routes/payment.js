const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const pool = require('../config/database').pool;

const paypal = require('paypal-rest-sdk');

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID, // please provide your client id here
    'client_secret': process.env.PAYPAL_SECRET // provide your client secret here
});

//Get all users
router.get('/', async function (req, res, next) {
    return res.render('index', {});
});

//Get reservation based on ID
router.get('/:price', async function (req, res, next) {
// create payment object
    const payment = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://127.0.0.1:3000/`,
            "cancel_url": "http://127.0.0.1:3000/payments"
        },
        "transactions": [{
            "amount": {
                "total": parseInt(req.params.price),
                "currency": "EUR"
            },
            "description": " a book on mean stack "
        }]
    };


    // call the create Pay method
    createPay(payment)
        .then((transaction) => {
            const id = transaction.id;
            const links = transaction.links;
            let counter = links.length;
            while (counter--) {
                if (links[counter].method === 'REDIRECT') {
                    // redirect to paypal where user approves the transaction
                    return res.redirect(links[counter].href)
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
});

// helper functions
const createPay = (payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function (err, payment) {
            if (err) {
                reject(err);
            } else {
                resolve(payment);
            }
        });
    });
};

module.exports = router;