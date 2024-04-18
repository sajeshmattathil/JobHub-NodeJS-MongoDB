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
const http_1 = __importDefault(require("http"));
const allowedOrigins = [
    "https://jobshub-nine.vercel.app",
    "http://localhost:5173",
];
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["https://jobshub-nine.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: false,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
});
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: false,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
io.on("connection", (socket) => {
    console.log(`⚡:user just connected!`);
    socket.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(message, 'recip');
        io.emit("messageResponse", message);
        try {
            yield chatService_1.default.saveChat(message);
        }
        catch (error) {
        }
    }));
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
    socket.on("vdo-call", (data) => __awaiter(void 0, void 0, void 0, function* () {
        io.emit("join-vdo-call", data);
    }));
});
app.use("/", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/hr", hrRoutes_1.default);
httpServer.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
