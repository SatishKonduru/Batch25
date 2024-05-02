const express = require('express')
const router = express.Router()
const {Product} = require('../models/productModel')

const {authenticateToken} = require('../AuthServices/authentication')
const {checkRole} = require('../AuthServices/checkRole')
 const {Category} = require('../models/categoryModel')
 const mongoose = require('mongoose')


//Getting all Products
router.get('/getAllProducts', async (req, res) => {
    const productList = await Product.find().populate('category')

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


router.post('/addProduct', authenticateToken, checkRole, async (req, res) => {
    const data = req.body
    const categoryId = data.category
    checkCategoryId = await Category.findById(categoryId)

    if(checkCategoryId == '' || checkCategoryId == null){
        return res.status(500).send({
            message: "Invalid Category"
        })
    }

    const product = new Product({
        name: data.name,
        description: data.description,
        price: data.price,
        countInStock: data.countInStock,
        category: data.category
    })

    newProduct = await product.save()
    if(!newProduct){
        return res.status(500).send({
            message: 'Some thing went wrong. Saving of new Product Failed. '
        })
    }
    else{
        return res.status(200).send({
            message: 'Product Added Successfully',
            newProduct: newProduct
        })
    }

})


//get product details by Id along with Category details
router.get('/getById/:id', authenticateToken, async (req, res) => {
    const productId = req.params.id
    productDetails = await Product.findById(productId).populate('category').select('name description price')
    if(!productDetails){
        return res.status(500).send({
            message: 'Product was not found'
        })
    }
    else{
        return res.status(200).send({
            message: 'Product Found',
            product: productDetails
        })
    }
})


//update product by id
router.patch('/update/:id', authenticateToken, checkRole,  async (req, res) => {
    const productId = req.params.id
    const newData = req.body
    if(!mongoose.isValidObjectId(productId)){
        return res.status(500).send({
            message: 'Invalid Object Id'
        })
    }

    updateProduct = await Product.findByIdAndUpdate(productId, {name: newData.name}, {new: true})
    if(!updateProduct){
        return res.status(500).send({
            message: 'Invalid Product Selection'
        })
    }
    else{
        return res.status(200).send({
            message: 'Product Updated Successfully',
            newData: updateProduct
        })
    }

})


//Delete Product
router.delete('/delete/:id',authenticateToken, checkRole, async (req, res)=>{ 
    const productId = req.params.id
    if(!mongoose.isValidObjectId(productId)){
        return res.status(500).send({
            message: 'Invalid Object Id'
        })
    }

    deleteProduct = await Product.findByIdAndDelete(productId)
    if(!deleteProduct){
        return res.status(500).send({
            message: 'No Produt was Found'
        })
    }
    else{
        return res.status(200).send({
            message: 'Product Deleted Successfully.'
        })
    }

})


//Getting product Count
router.get('/getCount',authenticateToken, checkRole,  async (req, res) => {
    productCount = await Product.countDocuments()
    if(!productCount){
        return res.status(500).send({
            message: 'No Products were found'
        })
    }
    else{
        return res.status(200).send({
            count: productCount
        })
    }
})


//Get Products by Category
router.get('/ByCategory/:id', async (req, res) => {
    const categoryId = req.params.id
    productDetails = await Product.find({category: categoryId}).populate('category')
    if(productDetails.length <= 0 ){
        return res.status(500).send({
            message: 'No Products were found in given Category'
        })
    }
    else{
        return res.status(200).send({
            products: productDetails
        })
    }
    
})

//get products count by category

router.get('/getCountByCategory/:id', authenticateToken, checkRole, async (req, res) => {
    const categoryId = req.params.id
    productCount = await Product.find({category: categoryId}).countDocuments()
    if(!productCount){
        return res.status(500).send({
            message: "No Products were found in given Category"
        })
    }
    else{
        return res.status(200).send({
            productCount: productCount
        })
    }
})

module.exports = router