import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    userId : String,
    otp : String,
    createdAt : {
        type : Date,
        required : true,
        index :{
            expires : 600
        } 
    }
})
const Otp = mongoose.model('otp',otpSchema)
export default Otp