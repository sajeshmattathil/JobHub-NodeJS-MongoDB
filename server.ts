import 'reflect-metadata'
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./Config/dbconnect";
dbConnect();
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { v4 as uuidv4 } from 'uuid';
// import adminRouter from "./Routes/adminRoutes";
import hrRouter from './src/routes/hrRoutes'
import adminRouter from './src/routes/adminRoutes'
import { Server, Socket } from "socket.io";
import chatService from "./Chat/chatService";
import userRouteSample from './src/routes/userRoutes'
import http from "http";

const allowedOrigins = [
  "https://jobshub-nine.vercel.app",
  "http://localhost:5173",
];
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://jobshub-nine.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const secretKey = process.env.SESSION_SECRET
if(secretKey){
  app.use(session({
    secret:secretKey, // Replace with your own secret key
    resave: false,
    saveUninitialized: true
  }));
}

io.on("connection", (socket: Socket) => {
  console.log(`⚡:user just connected!`);
  socket.on("message",  async (message) => {
    console.log(message,'recip');

    io.emit("messageResponse", message, );
    try {
      await chatService.saveChat(message);
    } catch (error) {
    }

  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.on("vdo-call", async (data) => {
    io.emit("join-vdo-call", data);
  });
});

app.use('/',userRouteSample)
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
