import mongoose from "mongoose";

const hrSchema = new mongoose.Schema({
    name :{
        type : String,
        required: true
    } ,
    email : {
        type : String,
        required: true
    },
    password: {
        type : String,
        required : true
    },
    isAdmin :  {
        type : Boolean,
        default : true
    },
    resume : String,
    isApproved : {
        type : Boolean,
        default : false
    },
    isVerified :  {
        type : Boolean,
        default : false
    }
})

const Hr = mongoose.model('Hr',hrSchema)

export default Hr
