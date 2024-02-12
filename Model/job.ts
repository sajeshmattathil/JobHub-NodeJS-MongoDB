import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
jobRole :{
        type : String,
        required: true
    } ,
    description : {
        type : String,
        required: true
    },
    qualification: {
        type : [String],
        required : true
    },
   
   
    company: {
        type : String,
        required : true
    },
    salaryFrom: {
        type : String,
        required : true
    },
    salaryTo :  {
        type : String,
        required : true
    },
    createdAt :  {
        type : Date,
        required : true
    },
})

const Job = mongoose.model('Job',jobSchema)

export default Job
