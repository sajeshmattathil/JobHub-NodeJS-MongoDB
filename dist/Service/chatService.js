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
        return;
    }
    catch (error) {
        return;
    }
});
const getChat = (recipient1, recipient2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatData = yield chatRepository_1.default.getChat(recipient1, recipient2);
        if (chatData && chatData.length)
            return { status: 201, data: chatData };
        else
            return { status: 400, data: null };
    }
    catch (error) {
        console.log(error, "error happened in chat service getting chat");
        return { status: 500, data: null };
    }
});
exports.default = {
    saveChat,
    getChat,
};
