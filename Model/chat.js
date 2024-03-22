"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    url: String,
    size: Number,
    fileName: String
});
const chatSchema = new mongoose_1.default.Schema({
    text: String,
    file: fileSchema,
    name: String,
    recipient1: String,
    recipient2: String,
    id: String,
    socketID: String
});
const chat = mongoose_1.default.model('chat', chatSchema);
exports.default = chat;
