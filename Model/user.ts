import mongoose from "mongoose";



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
    skills : [String],
    experience : String,
    resume : String,
    noOfJobsApplied : Number ,
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
