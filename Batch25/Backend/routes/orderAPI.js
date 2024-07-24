const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../AuthServices/authentication')
const {Order} = require('../models/orderModel')
const {Cart} = require('../models/cartModel')
const {checkRole} = require('../AuthServices/checkRole')

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


router.get('/getAllOrders', authenticateToken, checkRole, async (req, res) => {
    try{
        const orders = await Order.find().populate('user').populate('items.product')
        return res.status(200).send({
            orders: orders
        })
    }
    catch(error){
        console.error('Errr while fetching orders: ', error)
        return res.status(500).send({
            message: 'Internal Server Error'
        })
    }
} )

router.patch('/updateOrderStatus/:oId', authenticateToken, checkRole, async (req, res)=>{
    const orderId = req.params.oId
    const newStatus = req.body
    try{
        checkOrder = await Order.findOne({_id: orderId})
        if(!checkOrder){
            return res.status(404).send({
                message: 'No Order found!'
            })
        }
        updateOrder = await Order.findByIdAndUpdate(orderId, {status: newStatus.status})
        if(updateOrder){
            return res.status(200).send({
                message: 'Order Status Updated Successfully.'
            })
        }
        else{
            res.status(401).send({
                message: 'Order Statsu was not Updated.'
            })
        }
    }
    catch(error){
        console.error('Error while updated the status of an Order:', error)
        return res.status(500).send({
            messge: 'Internal Server Error'
        })
    }
})




module.exports = router