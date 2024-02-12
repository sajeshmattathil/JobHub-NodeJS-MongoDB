import { NextFunction ,Request,Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
});
const fileUpload =async (req : Request, res : Response,next : NextFunction)=>{
  try {
    // if(req.body)const resume = req.body.file
    console.log(req.body,'middleware')
    // const upload =await cloudinary.uploader.upload(req.body.resume, { resource_type: "raw" }, (error, result) => {
    //   if (error) {
    //     console.error(error,'errorrrrrr');
    //   } else {
    //     console.log(result,'resultttt');
    //   }
    
    // });
  
  } catch (error) {
    console.log(error);
    
  }
}




export default fileUpload

function next() {
  throw new Error('Function not implemented.');
}
