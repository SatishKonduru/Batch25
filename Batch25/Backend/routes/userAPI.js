const express = require('express')
const connection = require('../connection')
const router = express.Router()
const { User } = require('../models/userModel')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {authenticateToken} = require('../AuthServices/authentication')
const {checkRole} = require('../AuthServices/checkRole')
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid Image Type')
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads' )
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({storage:storage})

//Getting all Users
router.get('/getUsers',authenticateToken, checkRole, async (req, res) => {
    const usersList = await User.find().select('name phone city')
    if(usersList.length <= 0){
        res.status(500).send({
            message: "No Users were found"
        })
    }
    else{
        res.status(200).send({
            users: usersList
        })
    }
})


//Register new User
router.post('/register', async (req, res) => {
    const userData = req.body

    const existingUser = await User.findOne({email: userData.email} )
    if(existingUser){
        return res.status(400).send({
            message: 'Email already Exists. Please use a different email address'
        })
    }

    newUser = new  User ({
        name: userData.name,
        email: userData.email,
        // password: userData.password,
        password: bcrypt.hashSync(userData.password, 10),
        phone: userData.phone,
        city: userData.city,
        country: userData.country
    })

    registeredUser = await newUser.save()
    if(!registeredUser){
        res.status(500).send({
            message: 'Internal Server Error. Registration Failed'
        })
    }
    else{
      res.status(200).send({
        message: 'User Registered Successfully',
        newUser: registeredUser
      })  
    }

})


//Getting user by Id
router.get('/getById/:id', authenticateToken, async (req, res) => {
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(401).send({
            message: 'Invalid User Id'
        })
    }
   userDetails = await User.findById(id)
   if(userDetails.length <= 0 ){
    return res.status(500).send({
        message: "Internal Server Error."
    })
   }
   else{
    return res.status(200).send({
        message: "User Found.",
        userDetails: userDetails
    })
   }

})


//login 
router.post('/login', async (req, res) => {
    const user = req.body
    const existingUser = await User.findOne({email: user.email})
    if(!existingUser){
        return res.status(400).send({
            message: "Invalid email id"
        })
    }
    if(existingUser && bcrypt.compareSync(user.password, existingUser.password)){
        const payload = {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
            name: existingUser.name
        }
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1d'})
        return res.status(200).send({
            token: accessToken
        })
    }
    else{
        return res.status(400).send({
            message: 'Wrong Password'
        })
    }




})


router.patch('/update/:id', uploadOptions.single('image') , authenticateToken, async (req, res) => {
    const userId = req.params.id
    const newData = req.body
    if(!mongoose.isValidObjectId(userId)){
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
    updateUser = await User.findByIdAndUpdate(userId, {
        name: newData.name,
        email: newData.email,
        phone: newData.phone,
        apartment: newData.apartment,
        street: newData.street,
        city: newData.city,
        state: newData.state,
        country: newData.country,
        image: imagePath
    }, {new: true})
    if(!updateUser){
        return res.status(500).send({
            message:" Invalid User Selection"
        })
    }
    else{
        return res.status(200).send({
            message: 'User Updated Successfully',
            newData: updateUser
        })
    }

})

module.exports = router