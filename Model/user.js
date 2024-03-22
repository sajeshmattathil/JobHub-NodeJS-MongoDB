"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    isSubscribed: { type: Boolean, default: false },
    plan: String,
    paymentId: String,
    startedAt: Date,
    expireAt: Date,
});
const userSchema = new mongoose_1.default.Schema({
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
    experience: String,
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
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
