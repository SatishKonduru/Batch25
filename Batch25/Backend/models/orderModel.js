const mongoose = require('mongoose')
const {User} = require('./userModel')
const {Product} = require('./productModel')
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum : ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending'
    }
})

orderSchema.virtual('id').get(function() {
    return this._id.toHexString()
})
orderSchema.set('toJSON', {virtuals: true})
const Order = mongoose.model('Order', orderSchema,'orders')
module.exports = { Order: Order}


