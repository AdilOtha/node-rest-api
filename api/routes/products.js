const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.js');

router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id")//select only particular fields
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc=>{
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
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
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /products",
                createdProduct: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // res.status(201).json({
    //     message: "Handling POST requests to /products!",
    //     createdProduct: product
    // });
});

router.get('/:productid', (req, res, next) => {
    const id = req.params.productid;

    Product.findById(id)
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
    // if (id === "special") {
    //     res.status(200).json({
    //         message: 'Special ID',
    //         id: id
    //     });
    // }
    // else {
    //     res.status(200).json({
    //         message: 'You passed an id'
    //     });
    // }
});

router.patch('/:productid', (req, res, next) => {
    const id = req.params.productid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productid', (req, res, next) => {
    const id = req.params.productid;
    Product.deleteMany({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;