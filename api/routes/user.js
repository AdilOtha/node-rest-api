const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user")

router.post('/signup', (req, res, next) => {
    console.log(req.body.email);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'User Created'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        });
                });
            }
        })
})

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed!'
                });
            }
            else {
                //console.log(user);
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    //console.log("****")
                    if (err) {
                        return res.status(401).json({
                            message: 'Authentication failed!'
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(200).json({
                            message: 'Welcome ' + user[0].email,
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: 'Authentication failed!'
                    });
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
})

module.exports = router;