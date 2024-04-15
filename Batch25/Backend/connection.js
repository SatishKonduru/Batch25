const mongoose = require('mongoose')

require('dotenv').config()

const connection = mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
}).then(()=>{
    console.log("Connected")
}).catch(() => {
    console.log("Connection Fial")
})

module.exports = connection