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
   
    resume : String,
    isApproved : {
        type : Boolean,
        default : false
    },
    company: {
        type : String,
        required : true
    },
    website: {
        type : String,
        required : true
    },
    employeesNumber : Number,
    experience : Number,
    isVerified :  {
        type : Boolean,
        default : false
    }
})

const Hr = mongoose.model('Hr',hrSchema)

export default Hr
