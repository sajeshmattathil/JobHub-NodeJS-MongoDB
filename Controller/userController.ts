 import { Request,Response } from "express"
 import userService from "../Service/userService"

 interface ReqBody {
        email : string ,
        password : string ,
        confirm : string
 }

 interface signupSubmitResponse {
    status : number,
    message : string
 }
 const signupSubmit = async (req: Request<{}, {}, ReqBody>, res: Response<signupSubmitResponse>) => {
    console.log(req.body)
   try{
        const newUser = await userService.createNewUser(req.body)
       
        res.status(201).json({status : 201 , message : 'User created succesfully'})
   }catch(error){
        res.status(500).json({status : 500 , message : 'Internal server error'})
   }   
}


export default {signupSubmit}