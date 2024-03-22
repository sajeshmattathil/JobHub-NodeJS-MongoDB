"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const appliedJobsSchema = new mongoose_1.default.Schema({
    hrId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    userId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    jobId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    appliedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isHRViewed: {
        type: Boolean,
        default: false
    },
    isShortlisted: {
        type: Boolean,
        default: false
    },
    isReplayed: {
        type: Boolean,
        default: false
    },
});
const appliedJobs = mongoose_1.default.model("appliedJobs", appliedJobsSchema);
exports.default = appliedJobs;
