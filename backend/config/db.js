import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`); // success
    } catch (error) {
      console.error(`Error: ${error.message}`);  
        exit(1); // failure
    }
    
}