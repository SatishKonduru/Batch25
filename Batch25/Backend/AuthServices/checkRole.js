require('dotenv').config()

function checkRole(req, res, next) {
    if(res.locals.role == process.env.USER){
        return res.status(401).send({
            message: 'User is not allowed for this request'
        });
    }
    else{
        next()
    }
}

module.exports = {checkRole : checkRole}