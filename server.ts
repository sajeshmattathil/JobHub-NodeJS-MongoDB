import dotenv from 'dotenv';
dotenv.config();
import dbConnect from './Config/dbconnect';
dbConnect()
import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import userRouter from './Routes/userRoutes'
import hrRouter from './Routes/hrRoutes'
import adminRouter from './Routes/adminRoutes'
import { Server ,Socket } from 'socket.io';
import http from 'http';
import chatService from './Service/chatService';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        // methods: ["GET", "POST"]
    }
});

app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))



io.on('connection',  (socket: Socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message',async (data : string)=>{
        console.log(data,'data_-->'); 
       
        io.emit('messageResponse', data);
        const saveChat = await chatService.saveChat(data)

    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');

    });
});

app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/hr', hrRouter)
console.clear()
server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
