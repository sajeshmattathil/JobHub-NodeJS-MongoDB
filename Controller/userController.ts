 import { Request,Response } from "express"
 import userService from "../Service/userService"
import { ObjectId } from "mongodb"
import jwt from '../Middleware/jwt'

 try{

 }catch(error){

 }

 interface ReqBody {
        email : string ,
        password : string ,
        confirm : string
 }

 interface signupSubmitResponse {
    status : number,
    message : string,
 }

 
 const signupSubmit = async (req: Request<{}, {}, ReqBody>, res: Response<signupSubmitResponse>) => {
    console.log(req.body)
   try{
        const newUser  = await userService.createNewUser(req.body)
        console.log(newUser,'$$$$');
       
         if(newUser?.message === 'User created')  res.status(201).json({status : 201 , message : 'User created successfully'})
         else res.status(400).json({status : 400 , message : 'Something went wrong ,try again'})
        
       
   }catch(error){
        res.status(500).json({status : 500 , message : 'Internal server error'})
   }   
}

interface loginSubmitResponse {
   status : number,
   message : string,
   userData ?: string ,
   token ?: string
}


const loginSubmit = async (req : Request<{}, {}, ReqBody>,res : Response <loginSubmitResponse>)=>{
   console.log(req.body)
    
   try{
    const verifyUser = await userService.verifyLoginUser(req.body)

    console.log(verifyUser.userData,'verify user');

    if(verifyUser?.userData) {
        const token = jwt.generateToken(verifyUser.userData)
            res.status(201).json({
               status : 201,
               message : "User verification successful",
               userData : verifyUser.userData,
               token : token 
            })
         }
      else{
         res.status(400).json({
            status : 400,
            message : "User login failed. Invalid credentials.",
            })
      }
   }catch(error){
      res.status(500).json({
         status : 500,
         message : "Internal server error",
        })
   }
}

export default {
   signupSubmit,
   loginSubmit,
}


