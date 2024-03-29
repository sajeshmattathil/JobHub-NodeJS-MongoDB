"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
    planName: String,
    amount: Number,
    duration: Number,
    paymentId: String,
    expiryAt: Date,
    users: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
});
const plan = mongoose_1.default.model('plan', planSchema);
exports.default = plan;
