import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  hrID: {
    type: ObjectId,
    required: true,
  },
  userID: {
    type: ObjectId,
    required: true,
  },
});
const followers = mongoose.model('followers',followerSchema)

export default followers
