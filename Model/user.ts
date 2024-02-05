import mongoose from "mongoose";

const addresSchema = new mongoose.Schema({
    address : String,
    city : String ,
    state : String ,
    PIN : Number ,
    country : String 
})

const subscriptionSchema = new mongoose.Schema({
    isSubscribed : Boolean ,
    plan : String ,
    paymentType : String ,
    startedAt : Date ,
    expireAt : Date 
})

const userSchema = new mongoose.Schema({
    fname : String,
    lname : String,
    email : {
        type : String,
        required: true
    },
    password: {
        type : String,
        required : true
    },
    mobile : Number,
    noOfJobsApplied : Number ,
    address : addresSchema,
    subscription : subscriptionSchema,
    isVerified : {
            type : Boolean,
            default : false
        },
    isBlocked : {
        type : Boolean,
        default : false
    }
})

const User = mongoose.model('users',userSchema)

export default User
