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
/* eslint-disable no-mixed-spaces-and-tabs */
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTPByEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailTransporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "74123loo@gmail.com",
                pass: "ofnmcnwftggwqith",
            },
        });
        const msg = `Your OTP is  ${otp}. This is a test OTP sent from JobHub. This message is for trial purposes only.`;
        const mailDetails = {
            from: "74123loo@gmail.com",
            to: email,
            subject: "Job Hub (Demo)",
            text: msg,
        };
        const send = yield mailTransporter.sendMail(mailDetails);
        if (send)
            console.log("Otp send successfully");
        else
            console.log("Error in sending otp");
    }
    catch (error) {
        console.log(error, "Error in sendig otp");
    }
});
exports.default = sendOTPByEmail;
