const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../AuthServices/authentication')
const {Order} = require('../models/orderModel')
const {Cart} = require('../models/cartModel')


router.post('/newOrder/:uId', authenticateToken, async (req, res) => {
    const userId = req.params.uId
    const orderDetails = req.body
    const orderAmount = req.body.bill

    try{
        const order = new Order({
            user: userId,
            items: orderDetails.data,
            totalPrice: orderAmount
        })
        await order.save()

        //clear cart
        const userCart = await Cart.findOne({user: userId})
        if(userCart){
            await userCart.clearItems()
        }
        res.status(200).send({
            message: 'Order Placed Successfully'
        })
    }
    catch(error){
        console.error("Unknown Error. No Order was Placed.", error)
        return res.status(500).send({
            message: 'Interanal Server Error'
        })
    }
})

router.get('/orderDetails/:uId', authenticateToken, async (req, res) => {
    const userId = req.params.uId
    try{
        const orders = await Order.find({user: userId}).populate('items.product')
        if(orders){
            res.status(200).send({
                orderDetails: orders
            })
        }
    }
    catch(error){
        console.error("Error while Fetching orders: ", error)
        return res.status(500).send({
            message: 'Internal Server Error'
        })
    }
})



module.exports = router