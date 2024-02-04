 import { ObjectId } from "mongodb"
 import bcrypt from 'bcrypt'
import User from "../Model/user"
 import userRepository from "../Repository/userRepository"
 
 
 try{

 }catch(error){

 }

interface ReqBody {
    email: string;
    password: string;
    confirm: string;
}

const createNewUser = async (user: ReqBody) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 5); 
        user.password = hashedPassword; 
        await User.create(user);
        return { message: 'User created' };
    } catch (error) {
        return { message: 'User not created' };
    }
}

interface userDetailsInterface {
   _id : ObjectId,
   email : string ,
   password : string
}

const verifyLoginUser = async (user : ReqBody)  =>{
  try{
     const userDetails : userDetailsInterface | undefined | null = await userRepository.findUser(user.email)
 

     if(userDetails !== undefined  && userDetails !== null){

      const comparePsw =await bcrypt.compare(user.password, userDetails.password)

          if(userDetails && comparePsw ) return {userData : userDetails.email, message : "user verified"}
          else return { userData : null , message : 'Password is incorrect'}
     }
    else{
      return { userData : null ,message : 'No user is found in this email' }
    } 
     
  }catch(error){
    console.log(error);
    return { userData: null, message : 'Something went wrong ' }
  }
}


export default {
              createNewUser,
              verifyLoginUser
            }