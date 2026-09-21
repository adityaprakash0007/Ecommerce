import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
       const conn = await mongoose.connect(process.env.MONGODB_URI);
       console.log("Connected to the database");
    } catch (error) {
        console.log('connection failed', error);
    }

}

export default connectDB;