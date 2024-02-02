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


app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

// app.use(session({
//     secret: uuidv4(),
//     resave: false,
//     saveUninitialized: true
// }))
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/hr', hrRouter)


app.listen(3000, () => { console.log('Listening to the server on http://localhost:3000'); })