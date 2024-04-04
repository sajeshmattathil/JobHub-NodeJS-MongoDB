"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (email) => {
    try {
        const token = jsonwebtoken_1.default.sign({ adminId: email }, process.env.ADMIN_SECRET_KEY, { expiresIn: '24h' });
        return token;
    }
    catch (error) {
        console.error('error happen in generating admin token');
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
        if (!token || role !== 'admin') {
            return res.json({ status: 404, message: 'Authentication failed' });
        }
        const decodedPayload = jsonwebtoken_1.default.verify(token, process.env.ADMIN_SECRET_KEY);
        console.log(decodedPayload.adminId, 'adminId');
        req.adminId = decodedPayload.adminId;
        next();
    }
    catch (error) {
        console.error('error happend in verifying user token and role');
    }
};
exports.default = {
    generateToken,
    verifyToken
};
