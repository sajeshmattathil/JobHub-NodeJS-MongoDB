"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (email, _id) => {
    try {
        console.log(_id, 'jwt');
        const token = jsonwebtoken_1.default.sign({ userId: email, _id: _id }, process.env.USER_SECRET_KEY, { expiresIn: "24h" });
        return token;
    }
    catch (error) {
        console.error("error happen in generating user token");
    }
};
const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const role = req.headers.role;
        let token = null;
        if (header !== undefined) {
            token = header.split(" ")[1];
        }
        if (!token || role !== "user") {
            return res.json({
                status: 404,
                message: "authentication or authorization failed in jwt verification",
            });
        }
        const decodedPayload = jsonwebtoken_1.default.verify(token, process.env.USER_SECRET_KEY);
        console.log(decodedPayload.userId, "User id");
        req.userEmail = decodedPayload.userId;
        req.userId = decodedPayload._id;
        console.log(req.userId, 'jwt-- verify');
        console.log("Access granted");
        next();
    }
    catch (error) {
        console.error("error happend in verifying user token and role");
        res.status(400).json({ status: 400, message: 'Error happend in verifying user' });
    }
};
exports.default = {
    generateToken,
    verifyToken,
};
