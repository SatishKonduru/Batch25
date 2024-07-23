const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoute = require('./routes/userAPI')
const productRoute = require('./routes/productAPI')
const categoryRoute = require('./routes/categoryAPI')
const cartRoute = require('./routes/cartAPI')

const api = process.env.API_URL  
const app = express()
app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(`${api}/user`, userRoute)
app.use(`${api}/product`, productRoute)
app.use(`${api}/category`, categoryRoute)
app.use(`${api}/cart`, cartRoute)  
app.use('/public/uploads', express.static(__dirname+'/public/uploads'))
 
module.exports = app