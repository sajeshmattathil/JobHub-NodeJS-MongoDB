import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  isSubscribed: { type: Boolean, default: false },
  plan: String,
  paymentId: String,
  startedAt: Date,
  expireAt: Date,
});
const workExperienceSchema = new mongoose.Schema({
  jobRole: String,
  company: String,
  from: Date,
  to: Date,
});

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: Number,
  skills: [String],
  educationalQualification: String,
  workExperience: [workExperienceSchema],
  resume: String,
  noOfJobsApplied: Number,
  subscription: subscriptionSchema,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
    
  },
});

const User = mongoose.model("users", userSchema);

export default User;
