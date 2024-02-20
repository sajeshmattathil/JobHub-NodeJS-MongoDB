import { ObjectId } from "mongodb";
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
    jobType : {
        type : String,
        required: true
    },
    locations :{
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
    hrObjectId : {
        type : ObjectId,
        required : true
    }
})

const Job = mongoose.model('Job',jobSchema)

export default Job
