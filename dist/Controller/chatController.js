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
const chatService_1 = __importDefault(require("../Service/chatService"));
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipient1 = req.query.recipient1;
        const recipient2 = req.query.recipient2;
        if (recipient1 !== undefined) {
            const response = yield chatService_1.default.getChat(String(recipient1), String(recipient2));
            if (response.message === "success")
                res.json({ status: 201, chatData: response.data });
            else
                res.json({ status: 400, chatData: null });
        }
    }
    catch (error) {
        console.log(error, "error in fetching chat at controller");
        res.json({ status: 500, chatData: null });
    }
});
exports.default = {
    getChat,
};
