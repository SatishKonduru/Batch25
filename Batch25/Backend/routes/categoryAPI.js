const {Category} = require('../models/categoryModel')
const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../AuthServices/authentication')
const {checkRole} = require('../AuthServices/checkRole')

//Getting all Categories
router.get('/getCategories', authenticateToken,  async (req, res) => {
    const categoryList = await Category.find()
    if(categoryList.length <= 0){
        return res.status(500).send({
            message: 'No Categories were found'
        })
    }
    else{
        return res.status(200).send({
            categories: categoryList
        })
    }
})

//add new category
router.post('/addCategory',authenticateToken, checkRole, async (req, res) => {
    const data = req.body
    const  category = new Category({
        name: data.name,
        icon: data.icon
    })

    newCategory = await category.save()
    if(!newCategory) {
        return res.status(500).send({
            message: 'Some thing went wrong. Saveing new category Failed'
        })
    }
    else{
        return res.status(200).send({
            message: 'Category Added Successfully',
            newCategory: newCategory
        })
    }


})


module.exports = router