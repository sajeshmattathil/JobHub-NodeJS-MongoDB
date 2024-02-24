import { ObjectId } from "mongodb"
import mongoose from "mongoose"

const appliedJobsSchema = new mongoose.Schema({
    hrId: {
        type: ObjectId,
        required: true,
      },
      userId :{
        type: ObjectId,
        required: true,
      },
      jobId :{
        type: ObjectId,
        required: true,
      },
      appliedAt : Date
})

const appliedJobs = mongoose.model("appliedJobs",appliedJobsSchema)
export default appliedJobs