 import { ObjectId } from "mongodb"
 import bcrypt from 'bcrypt'
import User from "../Model/user"
 import userRepository from "../Repository/userRepository"
import Otp from "../Model/otp";
 
 
 try{

 }catch(error){

 }

interface ReqBody {
  fname : string,
  lname  : string,
    email: string;
    password: string;
    confirm: string;
}

const createNewUser = async (user: ReqBody) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 5); 
        user.password = hashedPassword; 
        const checkExistingUsers = await userRepository.findUser(user.email)
        if(checkExistingUsers) return {message : 'exists'}
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
interface otp {
  userId : string ,
  otp : string,
  createdAt : Date
}
const saveOtp = async (data : otp )=>{
  try {
    console.log(data,"saveOtp");

    const checkUserExists =await getSavedOtp(data.userId)
    console.log(checkUserExists,'checkUserExists')
    if(checkUserExists){
      await userRepository.findAndUpdateOtp(data)
    }
    else{
      const saveOtp = await Otp.create(data)
     console.log(saveOtp,'>>>>')

    } 

    return
  } catch (error) {
    
  }
}

const getSavedOtp = async (userID : string)=>{
  try {
    const getOtp = await userRepository.getOtp(userID)
    if(getOtp)return getOtp
       else return 
  } catch (error) {
    console.log("Otp not found")
  }
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

const setVerifiedTrue = async (userId : string)=>{
  try {
    const setVerifiedTrue = await userRepository.setVerifiedTrue(userId)
  } catch (error) {
    
  }
}


export default {
              createNewUser,
              saveOtp,
              getSavedOtp,
              setVerifiedTrue,
              verifyLoginUser,
            }