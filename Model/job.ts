import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const appliedAndSshortListSchema = {
  email : String,
  isShortListed : Boolean
}

const jobSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  qualification: {
    type: [String],
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  locations: {
    type: [String],
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  salaryPackage: {
    type: {
      min: Number,
      max: Number
    }
  },  
  educationalQualification: {
    type: String,
    required: false,
  },
  industry: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  hrObjectId: {
    type: ObjectId,
    required: true,
  },
  appliedUsers: {
    type: [appliedAndSshortListSchema],
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
