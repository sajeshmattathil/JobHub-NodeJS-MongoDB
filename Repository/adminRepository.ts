import Admin from "../Model/admin";
import User from "../Model/user";

const findAdmin = async (email : string) =>{
    try{
        const adminData = await Admin.findOne({email : email})
        console.log(adminData,"ddddd");
        
        return adminData
  
      }catch(error){
          console.log(error);        
      }
}
const getAllUsers = async ()=>{
    try {
        return await User.find({})
    } catch (error) {
        console.log('Data of all users not found');
        return
    }
}

const blockUblockUser = async (email : string)=>{
    try {
        // return await User.updateOne({email : email},{$set : {isBlocked : !isBlocked}})
    } catch (error) {
        
    }
}

export default {
    findAdmin,
    getAllUsers,
    blockUblockUser
}