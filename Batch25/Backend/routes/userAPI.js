const express = require('express')
const connection = require('../connection')
const router = express.Router()
const { User } = require('../models/userModel')

//Getting all Users
router.get('/getUsers', async (req, res) => {
    const usersList = await User.find()
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
    newUser = new  User ({
        name: userData.name,
        email: userData.email,
        password: userData.password,
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


module.exports = router