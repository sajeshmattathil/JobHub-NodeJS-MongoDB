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
import http from "http";
import chatService from "./Service/chatService";
import Razorpay from "razorpay";

const io = new Server({
  cors: {
    origin: "http://localhost:3001",
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
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});
app.post("/create-order", async (req, res) => {
  try {
    console.log(111);
    const { amount } = req.body;
    const options = {
      amount,
      currency: "INR",
      receipt: "order_rcptid_11",
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
    console.error("Error:", error);
  }
});
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);

app.listen(3001, () => {
  console.log(`Server is running on port 3000`);
});
io.listen(3001);
