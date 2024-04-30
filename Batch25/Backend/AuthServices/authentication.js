require('dotenv').config()
const jwt = require('jsonwebtoken')


function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.status(401).send({
            message: 'UnAnthorized, Null token found'
        })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, response) => {
        if(err){
            return res.status(403).send({
                message: "Token Verification Failed"
            })
        }
        else{
            res.locals = response
            next()
        }
    })



}


module.exports = {authenticateToken : authenticateToken}