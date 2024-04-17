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

// io.on("connection", (socket: Socket) => {
//   console.log(`⚡:user just connected!`);
//   socket.on("message",  ({recipient ,message}) => {
//     console.log(recipient,message,'recip');

//     io.to(recipient).emit("messageResponse", message, async (acknowledgment: string) => {
//       if (acknowledgment === "success") {
//         console.log("Message emitted successfully");
//       } else {
//         console.log("Message emission failed");
//       }

//     });
//     // try {
//     //   await chatService.saveChat(message);
//     // } catch (error) {
//     // }

//   });
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
//   socket.on("vdo-call", async (data) => {
//     io.emit("join-vdo-call", data);
//   });
// });

let pairedUsers: [string, string][];
io.on("connection", (socket) => {
  console.log(`⚡: User connected!`);
  socket.on("join-chat", (userPair) => {
    console.log(userPair,'join chat');
    
   if(userPair.length){
  if(pairedUsers&&pairedUsers.length){
    const checkNewPairExist = pairedUsers.find((user) =>
      user.includes(userPair[0]) && userPair[1]
  )
  console.log(checkNewPairExist,'exist or not');
  
  if (!checkNewPairExist)
   {
    console.log('entered');
    
    pairedUsers = [userPair, ...pairedUsers];
    console.log(pairedUsers,'pairedusers');
    
  }else  console.log(`User  is already in the allowed users list.`);

  }
  else{
    pairedUsers = [...userPair];
    console.log(pairedUsers,'pairedusers');
  }
 
   } 
  });

  socket.on("message", async ({ recipient, message }) => {
    try {
      console.log(message,pairedUsers, "msg && arr");
     if(pairedUsers && pairedUsers.length){
      const checkUser = pairedUsers.find((user) => user.includes(recipient));
      if (checkUser?.length) {
        io.to(recipient).emit("messageResponse", message);

        await chatService.saveChat(message);

        console.log("Message emitted successfully");
      }
     }
    } catch (error) {
      console.error("Error emitting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚡: User disconnected");
  });

});

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/hr", hrRouter);

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
