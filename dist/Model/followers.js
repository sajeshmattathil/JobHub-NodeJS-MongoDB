"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const followerSchema = new mongoose_1.default.Schema({
    hrID: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    userID: {
        type: mongodb_1.ObjectId,
        required: true,
    },
});
const followers = mongoose_1.default.model('followers', followerSchema);
exports.default = followers;
