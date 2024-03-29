import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./Config/dbconnect";
dbConnect();
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import userRouter from "./Routes/userRoutes";
import hrRouter from "./Routes/hrRoutes";
import adminRouter from "./Routes/adminRoutes";
import { Server, Socket } from "socket.io";
import chatService from "./Service/chatService";
import Razorpay from "razorpay";

// const allowedOrigins = ['https://job-hub.online', 'www.job-hub.online'];

// const io = new Server({
//   cors: {
//     origin:allowedOrigins,
//     // methods: ["GET", "POST"]
//   },
// });
// app.use(cors({
//   origin: allowedOrigins
// }));

const io = new Server({
  cors: {
    origin:"http://localhost:5173",
    // methods: ["GET", "POST"]
  },
});
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", async (data: string) => {
    console.log(data, "data_-->");

    io.emit("messageResponse", data);
    await chatService.saveChat(data);
  });
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
  socket.on("vdo-call", async (data) => {
    io.emit("join-vdo-call", data);
  });
});

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
io.listen(3000);


