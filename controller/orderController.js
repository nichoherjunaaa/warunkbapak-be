import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import midtransClient from 'midtrans-client'
import dotenv from 'dotenv'
dotenv.config()

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});


export const createOrder = asyncHandler(async (req, res) => {
    const { email, firstname, lastname, phone, cartItem } = req.body
    if (!cartItem || cartItem.length === 0) {
        res.status(400)
        throw new Error('Keranjang Kosong !')
    }
    let orderItem = []
    let orderMidtrans = []
    let total = 0

    for (const cart of cartItem) {
        const productData = await Product.findOne({ _id: cart.product })
        if (!productData) {
            res.status(400)
            throw new Error('Produk tidak ada !')
        }
        const { name, price, _id } = productData
        const singleProduct = {
            quantity: cart.quantity,
            name,
            price,
            product: _id
        }
        const shortName = name.substring(0, 30)
        const singleProductMidtrans = {
            quantity: cart.quantity,
            name: shortName,
            price,
            id: _id
        }
        orderItem = [...orderItem, singleProduct]
        orderMidtrans = [...orderMidtrans, singleProductMidtrans]
        total += cart.quantity * price
    }

    const order = await Order.create({
        itemsDetail: orderItem,
        total,
        user: req.user.id,
        email,
        firstname,
        lastname,
        phone
    })
    let parameter = {
        "transaction_details": {
            "order_id": order._id,
            "gross_amount": total,
        },
        "item_details": orderMidtrans,
        "customer_details": {
            "first_name": firstname,
            "last_name": lastname,
            "email": email,
            "phone": phone,
        }
    }
    const token = await snap.createTransaction(parameter)

    res.status(201).json({
        total,
        order,
        message: 'Berhasil Order Produk',
        token
    })
})

export const allOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    res.status(201).json({
        data: orders,
        message: 'All Order Produk',
    })
})
export const detailOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    res.status(201).json({
        data: order,
        message: 'Detail Order Produk',
    })
})
export const currentAuthOrder = asyncHandler(async (req, res) => {
    const userOrder = await Order.find({ user: req.user.id })
    res.status(201).json({
        data: userOrder,
        message: 'User Order Produk',
    })
})

export const callbackPayment = asyncHandler(async (req, res) => {
    const statusResponse = await snap.transaction.notification(req.body)
    console.log(req.body);
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    const orderData = await Order.findById(orderId)
    if (!orderData) {
        res.status(404)
        throw new Error('Order not found')
    }
    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'accept') {
            const orderProduct = orderData.itemsDetail
            console.log(orderProduct);
            for(const itemProduct of orderProduct) {
                const productData = await Product.findById(itemProduct.product)
                if(!productData){
                    res.status(404)
                    throw new Error('Product not found')
                }
                productData.stock = productData.stock - itemProduct.quantity
                await productData.save()
            }
            orderData.status = 'success'
        }
    } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire') {
        orderData.status = 'failed'
    } else if (transactionStatus == 'pending') {
        orderData.status = 'pending'
    }
    await orderData.save()
    console.log(orderData.status);
    
    return res.status(200).send('Payment Notif Berhasil')
})


