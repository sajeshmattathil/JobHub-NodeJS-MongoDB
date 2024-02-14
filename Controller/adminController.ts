import { Request , Response } from "express"
import jwt from "../Middleware/JWT/jwtUser"
import adminService from "../Service/adminService"


interface loginBody {
    email : string,
    password : string,
}
interface loginSubmitResponse {
    status : number,
    message : string,
    adminData ?: string ,
    token ?: string
 }
 
const loginSubmit = async (req : Request<{}, {}, loginBody>,res : Response <loginSubmitResponse>)=>{
    try{
        const verifyAdmin = await adminService.verifyLoginAdmin(req.body)
    
        console.log(verifyAdmin.adminData,'verify user');
    
        if(verifyAdmin?.adminData) {
            const token = jwt.generateToken(verifyAdmin.adminData)
                res.status(201).json({
                   status : 201,
                   message : "User verification successful",
                   adminData : verifyAdmin.adminData,
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

const getAllUsers = async (req : Request,res : Response )=>{
   try {
       const response = await adminService.getAllUsers()
       console.log(response,'response');
       if(response) res.status(201).json({usersData : response,status : 201}) 
       else res.status(404).json( {usersData : null,status :404 }) 
       
   } catch (error) {
      res.status(500).json( {usersData : null,status :500 }) 
   }
}
 interface blockunblock{
   email : string,
   isBlocked : boolean
 }

const blockUnblockUser = async (req : Request<{}, {}, blockunblock>,res : Response) =>{
   try {
      const response = await adminService.blockUblockUser(req.body.email,req.body.isBlocked)
      console.log(response,'blockREsoponse');

      if(response.message) {
         res.status(201).json({status :201})
      } 

      else{
         res.status(404).json({status : 404})
      } 
      
   } catch (error) {
      
   }
}

export default {
    loginSubmit,
    getAllUsers,
    blockUnblockUser
}