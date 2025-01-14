import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Keluar dari proses dengan kode error
    }
};

export default connectDB;