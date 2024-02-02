import mongoose from 'mongoose';

interface CustomError {
    message : string
}

const dbConnect = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Jobs')
          console.log("db connction is successful")
    }catch(error  ){
          console.log("db connection failed:",(error as CustomError).message)
    } 
           
} 

export default dbConnect