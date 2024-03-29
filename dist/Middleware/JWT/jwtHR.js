"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (email, _id) => {
    try {
        const token = jsonwebtoken_1.default.sign({ HRId: email, _id: _id }, process.env.HR_SECRET_KEY, { expiresIn: '24h' });
        return token;
    }
    catch (error) {
        console.error('error happen in generating HR token');
    }
};
const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const role = req.headers.role;
        let token = null;
        if (header !== undefined) {
            token = header.split(' ')[1];
        }
        if (!token || role !== 'HR') {
            return res.json({ status: 404, message: 'Authentication failed' });
        }
        const decodedPayload = jsonwebtoken_1.default.verify(token, process.env.HR_SECRET_KEY);
        console.log(decodedPayload.userId, 'User id');
        req.HRId = decodedPayload.HRId;
        req._id = decodedPayload._id;
        console.log('Access granted');
        next();
    }
    catch (error) {
        console.error('error happend in verifying HR token and role');
    }
};
exports.default = {
    generateToken,
    verifyToken
};
