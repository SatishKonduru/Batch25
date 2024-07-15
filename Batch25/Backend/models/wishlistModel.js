const mongoose = require('mongoose')
const {Product} = require('./productModel')
const {User} = require('./userModel')

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    dateCreated: {
        type:Date,
        default: Date.now
    }
})
wishlistSchema.virtual('id').get(function() {
    return this._id.toHexString()
})
wishlistSchema.set('toJSON', {virtuals: true})
const Wishlist = mongoose.model('Wishlist', wishlistSchema,'wishlists')
module.exports = { Wishlist: Wishlist}