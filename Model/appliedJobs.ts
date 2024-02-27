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
      appliedAt : Date,
      isDeleted : {
        type : Boolean,
        default : false
      },
      isHRViewed : {
        type : Boolean,
        default : false
      },
      isShortlisted : {
        type : Boolean,
        default : false
      },
      isReplayed : {
        type : Boolean,
        default : false
      },
})

const appliedJobs = mongoose.model("appliedJobs",appliedJobsSchema)
export default appliedJobs