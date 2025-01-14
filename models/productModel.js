import mongoose from 'mongoose';
const { Schema } = mongoose;


const productSchema = new Schema({
    name : {
        type : String,
        required : [true, "Nama produk harus diisi"],
        unique : [true, "Nama produk sudah ada"],
    },
    price : {
        type : Number,
        required : [true, "Harga harus diisi"],
    },
    description : {
        type : String,
        required : [true, "Deskripsi harus diisi"],
    },
    image : {
        type : String,
        default : null,
    },
    category : {
        type : String,
        required : [true, "Kategori harus dipilih"],
        enum : ["Sepatu", "Kemeja", "Baju", "Celana"],
    },
    stock : {
        type : Number,
        default : 0,
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product