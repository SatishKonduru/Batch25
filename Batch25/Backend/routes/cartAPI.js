const express = require('express')
const router = express.Router()
const {User} = require('../models/userModel')
const {Product} = require('../models/productModel')
const {authenticateToken} = require('../AuthServices/authentication')
const { Cart } = require('../models/cartModel')

router.put('/addToCart/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.body.id;
        console.log("Product Id in Backend: ", productId)
        const quantity = req.body.quantity || 1; // Default quantity is 1 if not provided

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        console.log("Cart Items:", cart.items); // Log cart items
        const existingItemIndex = cart.items.findIndex(item => item.product && item.product.toString() === productId);
        console.log("Existing Item Index: ", existingItemIndex);
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity: quantity });
        }

        await cart.save();

        res.status(200).send({ message: 'Product added to cart successfully', cart: cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

//  get cart products for a particular user
router.get('/getCart/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        res.status(200).send({ cart: cart });
    } catch (error) {
        console.error('Error fetching cart products:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.delete('/deleteProduct/:uId/:pId', authenticateToken, async (req, res) => {
    const userId = req.params.uId
    const productId = req.params.pId

    console.log("UserId and Product Id:", userId, productId)
    try{
        const cart = await Cart.findOne({user: userId})
        if(!cart){
            return res.status(404).send({
                message: 'Cart NOT found'
            })
        }
        // find the index of the item to be removed
        const index = cart.items.findIndex(item => item.product.toString() === productId)
        if(index === -1){
            return res.status(404).send({
                message: 'Product NOT found in the CART'
            })
        }
        //remove the item from cart
        cart.items.splice(index, 1)

        //save the updated cart
        await cart.save()
        res.status(200).send({
            message: 'Product removed from the cart succssfully'
        })

    }
    catch(error){
        console.error("Error while removing product from the cart: ", error)
        res.status(500).send({
            messge:'Internal Server Error'
        })
    }
})
module.exports = router