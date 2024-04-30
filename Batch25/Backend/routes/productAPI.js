const express = require('express')
const router = express.Router()
const {Product} = require('../models/productModel')

//Getting all Products
router.get('/getAllProducts', async (req, res) => {
    const productList = await Product.find()

    if(productList.length <= 0 ){
        res.status(500).send({
            message: 'No Products were found'
        })
    }
    else{
        res.status(200).send({
            product: productList
        })
    }
})

module.exports = router