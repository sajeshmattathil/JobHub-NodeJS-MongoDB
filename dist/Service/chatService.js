"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = __importDefault(require("../Model/chat"));
const chatRepository_1 = __importDefault(require("../Repository/chatRepository"));
const saveChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newChat = new chat_1.default(data);
        newChat.save();
    }
    catch (error) {
        console.log(error, "error happened in chat service saving chat");
    }
});
const getChat = (recipient1, recipient2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatData = yield chatRepository_1.default.getChat(recipient1, recipient2);
        console.log(chatData, "chatdata");
        if (chatData && chatData.length)
            return { message: "success", data: chatData };
        else
            return { message: "failed", data: null };
    }
    catch (error) {
        console.log(error, "error happened in chat service getting chat");
        return { message: "failed", data: null };
    }
});
exports.default = {
    saveChat,
    getChat,
};
