const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true
          },
    email: {
            type: String,
            required: true
         },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        default: ''
    },
    street: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user'
        
    },
    
    image: {
        type: String,
        default: ''
    }
})

userSchema.virtual('id').get(function() {
    return this._id.toHexString()
})
userSchema.set('toJSON', {virtuals: true})

const User = mongoose.model('User', userSchema, 'users')

module.exports = {User: User}