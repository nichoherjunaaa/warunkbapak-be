import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

export const createOrder = asyncHandler(async (req, res) => {
    const { email, firstname, lastname, phone, cartItem } = req.body
    if (!cartItem || cartItem.length === 0) {
        res.status(400)
        throw new Error('Keranjang Kosong !')
    }
    let orderItem = []
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
        orderItem = [...orderItem, singleProduct]
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

    res.status(201).json({
        total,
        order,
        message: 'Berhasil Order Produk'
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


