import { ObjectId } from "mongodb";
import mongoose from "mongoose";

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
  salaryScale: {
    type: String,
    required: true,
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
    type: [String],
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
