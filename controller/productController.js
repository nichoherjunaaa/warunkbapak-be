import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'
import { v2 as cloudinary } from 'cloudinary'
import stremifier from 'streamifier'

export const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body)
    res.status(201).json({
        message: 'Product created',
        data: newProduct
    })
})

export const allProducts = asyncHandler(async (req, res) => {

    const queryObj = { ...req.query }

    const excludeFields = ['page', 'limit', 'name']
    excludeFields.forEach(el => delete queryObj[el])

    let query

    if (req.query.name) {
        query = Product.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    } else {
        query = Product.find(queryObj)
    }
    // console.log(queryObj);

    const page = req.query.page * 1 || 1
    const limitData = req.query.limit * 1 || 30
    const skipData = (page - 1) * limitData
    query = query.skip(skipData).limit(limitData)

    let countProducts = await Product.countDocuments()

    if (req.query.page) {
        if (skipData >= countProducts) {
            res.status(404)
            throw new Error('This page does not exist')
        }
    }

    const data = await query

    res.status(200).json({
        message: 'Success get all products',
        data,
        count: countProducts
    })
})

export const detailProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const product = await Product.findById(paramsId)
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }
    return res.status(200).json({
        message: 'Success get detail product',
        data: product
    })
})

export const updateProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const product = await Product.findByIdAndUpdate(paramsId, req.body, {
        new: true,
        runValidators: false
    })
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }
    return res.status(200).json({
        message: 'Success update product',
        data: product
    })
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id
    const product = await Product.findByIdAndDelete(paramsId)
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }
    return res.status(200).json({
        message: 'Success delete product',
        data: product
    })
})

export const uploadDataProduct = asyncHandler(async (req, res) => {
    const stream = cloudinary.uploader.upload_stream({
        folder: "uploads",
        allowed_formats: ['jpg', 'png', 'jpeg'],

    },
        function (err, result) {
            if (err) {
                return res.status(500).json({
                    message: 'gagal upload gambar !',
                    error: err
                });
            }
            res.json({
                message: 'Berhasil upload gambar!',
                url: result.secure_url,
            })
        })
        stremifier.createReadStream(req.file.buffer).pipe(stream);
})
