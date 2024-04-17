import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    razorpayId :{
        type:String,
        required:true
    },
    planName : String,
    amount : Number,
    userId : ObjectId,
    time : Date
})

const transaction = mongoose.model('transaction',transactionSchema)
export default transaction