import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import adminRepository from '../Repository/adminRepository'
try{

}catch(error){

}

interface loginBody {
    email : string,
    password : string,
}

interface adminDetailsInterface {
    _id : ObjectId,
    email : string ,
    password : string
 }

const verifyLoginAdmin =async (body : loginBody)=>{
    try{
        const adminDetails : adminDetailsInterface | undefined | null = await adminRepository.findAdmin(body.email)
    
        if(adminDetails !== undefined  && adminDetails !== null){
   
         const comparePsw =await bcrypt.compare(body.password, adminDetails.password)
   
             if(adminDetails && comparePsw ) return {adminData : adminDetails.email, message : "Admin verified"}
             else return { adminData : null , message : 'Password is incorrect'}
        }
       else{
         return { adminData : null ,message : 'No user is found in this email' }
       } 
        
     }catch(error){
       console.log(error);
       return { adminData: null, message : 'Something went wrong ' }
     }
}

const getAllUsers = async ()=>{
  try {
    const getAllUsers = await adminRepository.getAllUsers()
    if(getAllUsers) return getAllUsers
  } catch (error) {
    console.log('Users data is not found');
    return
  }
}

const blockUblockUser = async(email : string,isBlocked : boolean)=>{
  try {
     const blockUblockUser = await adminRepository.blockUblockUser(email,isBlocked)
     console.log(blockUblockUser,'blockUblockUser') 
     if(blockUblockUser) return {message : true}
     else return {message : null}
  } catch (error) {
    console.log('Error in block n unblock',error);
    return {message : null}
  }
}
const getHiringManagers = async ()=>{
  try {
    const getHiringManagers = await adminRepository.getHiringManagers()
   if(getHiringManagers !== undefined ){
    if(getHiringManagers.length) return {
      message : 'success',
      data : getHiringManagers
    }
   }
   else{
    return {message : 'failed',
            data : null
  }
   }
  } catch (error) {
    console.log('error happened in fetching hiring managers data in adminService'); 
  }
}
const blockUnblockHR = async (email : string,isBlocked : boolean)=>{
  try {
    const blockUblockHR = await adminRepository.blockUblockHR(email,isBlocked)
    console.log(blockUblockHR,'blockUblockUser') 
    if(blockUblockHR) return {message : true}
    else return {message : null}
 } catch (error) {
   console.log('Error in block n unblock',error);
   return {message : null}
 }
}
const hrApprove = async (email : string)=>{
  try {
    const hrApprove = await adminRepository.hrApprove(email)
    console.log(hrApprove,'hrApprove') 
    if(hrApprove) return {message : true}
    else return {message : null}
 } catch (error) {
   console.log('Error in hrApprove',error);
   return {message : null}
 }
}
export default {
    verifyLoginAdmin,
    getAllUsers,
    blockUblockUser,
    getHiringManagers,
    blockUnblockHR,
    hrApprove
}