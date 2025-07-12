import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const connectDB = async () => {
    try{

        mongoose.connection.on('connected', () => console.log('Database connected...'))
        await mongoose.connect(`${process.env.mongodb_uri}/ecommerce`)

    }catch(err) {
        console.log("Mongodb connection failed...")
        process.exit(1);
    }
}

export default connectDB;