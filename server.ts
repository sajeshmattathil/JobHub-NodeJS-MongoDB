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

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
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
});

const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()


io.on("connection",(socket)=> {
    socket.on("join-room",(data)=>{
        const {roomId,emailId} = data;
        console.log("User",emailId,"joined room ",roomId)
        emailToSocketMapping.set(emailId,socket.id)
        socketToEmailMapping.set(socket.id,emailId)

        socket.join(roomId)
        socket.emit('joined-room',roomId)
        socket.broadcast.to(roomId).emit("user-joined",{emailId})

    })
    socket.on('call-user',(data)=>{
        console.log(data,'data incoming emit ');
        
        const {emailId,offer} = data;
        const socketId = emailToSocketMapping.get(emailId)
        const fromEmail = socketToEmailMapping.get(socket.id)
socket.to(socketId).emit('incomming-call',{from : fromEmail,offer})

    })
})
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
io.listen(3001);
