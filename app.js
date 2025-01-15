import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRouter.js'
import productRouter from './routes/productRouter.js'
import orderRouter from './routes/orderRouter.js'
import dbConnection from './config/dbConnection.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary';
import helmet from 'helmet'
import mongoExpressSanitize from 'express-mongo-sanitize'

dotenv.config()
const app = express()
const port = 3000

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// middleware
app.use(helmet())
app.use(mongoExpressSanitize())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

dbConnection()

app.get('/', (req, res) => {
    res.send('Server Ready !')
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/order', orderRouter)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})