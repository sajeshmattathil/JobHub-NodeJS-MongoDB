import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const {MONGO_URI} = process.env;

interface CustomError {
    message : string
}

const dbConnect = async ()=>{
    try{
        await mongoose.connect(MONGO_URI!)
        console.log("db connction is successful")
    }catch(error  ){
        console.log("db connection failed:",(error as CustomError).message)
    } 
           
} 

export default dbConnect