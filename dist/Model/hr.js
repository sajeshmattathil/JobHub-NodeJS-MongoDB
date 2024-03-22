"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hrSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resume: String,
    isApproved: {
        type: Boolean,
        default: false
    },
    company: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    employeesNumber: Number,
    experience: Number,
    isVerified: {
        type: Boolean,
        default: false
    },
    followers: {
        type: [String]
    }
});
const Hr = mongoose_1.default.model('Hr', hrSchema);
exports.default = Hr;
