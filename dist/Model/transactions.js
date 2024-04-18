"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    razorpayId: {
        type: String,
        required: true
    },
    planName: String,
    amount: Number,
    userId: mongodb_1.ObjectId,
    time: Date
});
const transaction = mongoose_1.default.model('transaction', transactionSchema);
exports.default = transaction;
