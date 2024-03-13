import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  planName: String,
  amount: Number,
  duration : Number,
  expiryAt: Date,
  users: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const plan = mongoose.model('plan',planSchema)

export default plan