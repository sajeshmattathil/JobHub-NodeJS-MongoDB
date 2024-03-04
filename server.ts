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
import https from 'https'
import http from 'http';

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

// app.use(session({
//     secret: uuidv4(),
//     resave: false,
//     saveUninitialized: true
// }))


io.on('connection', (socket: Socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message',(data : string)=>{
        console.log(data,'data_-->'); 
        io.emit('messageResponse', data);

    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');

    });
});
app.get('/download', (req, res) => {
    const pdfHttpLink = 'https://res.cloudinary.com/dbi1vicyc/image/upload/v1708971669/resume/ewuba1owlqq6qz7ehc3d.pdf'; // Replace with your actual PDF link

    https.get(pdfHttpLink, (pdfResponse) => {
        const filename = 'downloaded_file.pdf'; // Set the filename for the downloaded file
console.log(filename,'filename')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        pdfResponse.pipe(res);
    }).on('error', (err) => {
        console.error('Error downloading PDF:', err);
        res.status(500).send('Error downloading PDF');
    });
});

app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/hr', hrRouter)
console.clear()
server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
// app.listen(3000, () => { console.log('Listening to the server on http://localhost:3000'); })