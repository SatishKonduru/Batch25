const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoute = require('./routes/userAPI')

const api = process.env.API_URL  
const app = express()
app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(`${api}/user`, userRoute)  
 
module.exports = app