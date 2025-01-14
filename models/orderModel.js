import mongoose from 'mongoose';
const { Schema } = mongoose

const singleProduct = Schema({
    name : {
        type : String,
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    product : {
        type : mongoose.Schema.ObjectId,
        ref : 'Product',
        required : true
    }
})


const orderSchema = new Schema({
    total : {
        type : Number,
        required : [true, "Total Harga harus diisi"],
    },
    itemsDetail : [singleProduct],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type : String,
        required : [true, "Status harus diisi"],
        enum : ["pending", "success", "failed"],
        default : "pending"
    },
    firstname : {
        type : String,
        required : [true, "Nama depan harus diisi"],
    },
    lastname : {
        type : String,
        required : [true, "Nama akhir harus diisi"],
    },
    phone : {
        type : String,
        required : [true, "Nomor telepon harus diisi"],
    },
    email : {
        type : String,
        required : [true, "Email harus diisi"],
    }
})

const Order = mongoose.model('Order', orderSchema);

export default Order