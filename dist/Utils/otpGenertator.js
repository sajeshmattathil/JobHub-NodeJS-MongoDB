"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateOtp = () => {
    const otp = String(Math.random()).slice(2, 8);
    if (String(otp).length < 6)
        generateOtp();
    else
        return otp;
};
exports.default = generateOtp;
