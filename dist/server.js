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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbconnect_1 = __importDefault(require("./Config/dbconnect"));
(0, dbconnect_1.default)();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const hrRoutes_1 = __importDefault(require("./Routes/hrRoutes"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const socket_io_1 = require("socket.io");
const chatService_1 = __importDefault(require("./Service/chatService"));
const razorpay_1 = __importDefault(require("razorpay"));
const io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173",
        // methods: ["GET", "POST"]
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, "data_-->");
        io.emit("messageResponse", data);
        yield chatService_1.default.saveChat(data);
    }));
    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
    socket.on("vdo-call", (data) => __awaiter(void 0, void 0, void 0, function* () {
        io.emit("join-vdo-call", data);
    }));
});
// const emailToSocketMapping = new Map();
// const socketToEmailMapping = new Map();
// io.on("connection",(socket)=> {
// socket.on('vdo-call',(data)=>{
//   console.log(data,'vdo data')
//   socket.emit('joinVdoCall',data)
//  })
//     socket.on("join-room",(data)=>{
//         const {roomId,emailId} = data;
//         console.log("User",emailId,"joined room ",roomId)
//         emailToSocketMapping.set(emailId,socket.id)
//         socketToEmailMapping.set(socket.id,emailId)
//         socket.join(roomId)
//         socket.emit('joined-room',roomId)
//         socket.broadcast.to(roomId).emit("user-joined",{emailId})
//     })
//     socket.on('call-user',(data)=>{
//         console.log(data,'data incoming emit ');
//         const {emailId,offer} = data;
//         const socketId = emailToSocketMapping.get(emailId)
//         const fromEmail = socketToEmailMapping.get(socket.id)
// socket.to(socketId).emit('incomming-call',{from : fromEmail,offer})
//     })
//     socket.on('call-accepted',(data)=>{
//       const {emailId,ans} = data
//       const socketId = emailToSocketMapping.get(emailId)
//       socket.to(socketId).emit("call-accepted",{ans})
//     })
// })
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
app.post("/create-order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(111);
        const { amount } = req.body;
        const options = {
            amount,
            currency: "INR",
            receipt: "order_rcptid_11",
            payment_capture: 1,
        };
        const order = yield razorpay.orders.create(options);
        res.json({ order });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create order" });
        console.error("Error:", error);
    }
}));
app.use("/", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/hr", hrRoutes_1.default);
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
io.listen(3001);
