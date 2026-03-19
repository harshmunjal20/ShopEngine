import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL); // we use await here because mongoose.connect returns a promise and we want to wait for connection to be established befor moving to next line of code. it returns object which contains connection details and we can access host from it.
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error.message);
        process.exit(1);
    }
};