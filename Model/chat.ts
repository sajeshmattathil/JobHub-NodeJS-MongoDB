import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    url : String,
    size : Number,
    fileName : String
})

const chatSchema = new mongoose.Schema({
    text : String,
    file : fileSchema ,
    name : String,
    recipient1 : String,
    recipient2 : String,
    id : String,
    socketID : String,
    time : Date
})

const chat = mongoose.model('chat',chatSchema)

export default chat