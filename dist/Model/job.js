"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const appliedAndSshortListSchema = {
    email: String,
    isShortListed: Boolean
};
const jobSchema = new mongoose_1.default.Schema({
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
        type: mongodb_1.ObjectId,
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
const Job = mongoose_1.default.model("Job", jobSchema);
exports.default = Job;
