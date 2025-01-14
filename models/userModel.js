import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcryptjs'
import validator from 'validator'


const userSchema = new Schema({
    name : {
        type : String,
        required : [true, "Nama harus diisi"],
        unique : [true, "Nama sudah digunakan"],
    },
    email : {
        type : String,
        required : [true, "Email harus diisi"],
        unique : [true, "Email terdaftar"],
        validate : {
            validator : validator.isEmail,
            message : "Email harus berformat @gmail.com"
        }
    },
    password : {
        type : String,
        required : [true, "Password harus diisi"],
        minLength : [8, "Password minimal 8 karakter"],
    },
    role : {
        type : String,
        enum : ['owner', 'user'],
        default : 'user'
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

export default User