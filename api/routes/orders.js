const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/order");

router.get('/', (req, res, next) => {
    Order.find()
        .select("product quantity _id")//select only particular fields
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        order_id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // res.status(200).json({
    //     message: "Orders have been fetched!"
    // });
});

router.get('/:orderid', (req, res, next) => {
    const id = req.params.orderid;

    Order.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
});

module.exports = router;