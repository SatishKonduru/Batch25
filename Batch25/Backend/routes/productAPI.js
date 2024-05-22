const express = require('express')
const router = express.Router()
const {Product} = require('../models/productModel')

const {authenticateToken} = require('../AuthServices/authentication')
const {checkRole} = require('../AuthServices/checkRole')
const {Category} = require('../models/categoryModel')
const mongoose = require('mongoose')
const multer = require('multer')


//Image File storage configuration
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb ) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invlid Image Type')
        if(isValid){
            uploadError = null
        }
       cb(uploadError, 'public/uploads') 
    },
    filename: function (req, file, cb) {
        const fName = file.originalname.split(' ').join('-')
        const fileName = fName.split('.')[0]
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)

    }
})

const uploadOptions = multer({storage: storage})

//Getting all Products
router.get('/getAllProducts', async (req, res) => {
    const productList = await Product.find().populate('category')

    if(productList.length <= 0 ){
        res.status(500).send({
            message: 'No Products were found'
        })
    }
    else{
        res.status(200).send(
            {
            products: productList
             })
        

    }
})


router.post('/addProduct', uploadOptions.single('image'), authenticateToken, checkRole, async (req, res) => {
    const data = req.body
    const categoryId = data.category

    const file = req.file
    if(!file){
        return res.status(400).send({
            message: 'No Image was found in request'}
        )
    }

    checkCategoryId = await Category.findById(categoryId)

    if(checkCategoryId == '' || checkCategoryId == null){
        return res.status(500).send({
            message: "Invalid Category"
        })
    }
const fileName = req.file.filename
const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
//    http://localhost:3000/public/uploads/brand-05052024.jpg
    const product = new Product({
        name: data.name,
        description: data.description,
        richDescription: Array.isArray(data.richDescription) ? data.richDescription[0] : data.richDescription, 
        image: `${basePath}${fileName}`,
        price: data.price,
        countInStock: data.countInStock,
        category: data.category,
        style: data.style,
        size: data.size,
        color: data.color,
        season: data.season,
        brand: data.brand
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
router.patch('/update/:id', uploadOptions.single('image'), authenticateToken, checkRole,  async (req, res) => {
    const productId = req.params.id
    const newData = req.body
    if(!mongoose.isValidObjectId(productId)){
        return res.status(500).send({
            message: 'Invalid Object Id'
        })
    }

    const file = req.file
    let imagePath;
    if(file){
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        imagePath = `${basePath}${fileName}`
    }

    updateProduct = await Product.findByIdAndUpdate(productId,{
                                                                name: newData.name,
                                                                description: newData.description,
                                                                richDescription: newData.richDescription,
                                                                price: newData.price,
                                                                category: newData.category,
                                                                countInStock: newData.countInStock,
                                                                style: newData.style,
                                                                size: newData.size,
                                                                color: newData.color,
                                                                season: newData.season,
                                                                brand: newData.brand,
                                                                image: imagePath
                                                              }, {new: true})
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


router.patch('/gallery-images/:id', uploadOptions.array('images', 10),  authenticateToken, checkRole, async (req, res) => {
 const id = req.params.id
 if(!mongoose.isValidObjectId(id)){
    return res.status(400).send({
        message: 'Invalid Object Id'
    })
 }
const product = await Product.findById(id)

if(!product){
    return res.status(400).send({
        message: 'Ivalid Product Selection'
    })
}

let imagePaths = []
const files = req.files
const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
if(files){
    files.map(file => {
        imagePaths.push(`${basePath}${file.filename}`)
})
}


updateProduct = await Product.findByIdAndUpdate(id, {images: imagePaths}, {new: true})
if(!updateProduct){
    return res.status(500).send({
        message: 'updating gallary is failed'
    })
}
else{
    return res.status(200).send({
        message: 'Product Updated successfully with Image Gallery',
        updateProduct: updateProduct
    })
}

})

module.exports = router