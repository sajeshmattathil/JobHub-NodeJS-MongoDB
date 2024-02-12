import Otp from "../Model/otp";
import User from "../Model/user"

try{

}catch(error){

}
 
 const findUser = async (email : string) =>{
    try{
      const userDatabase = await User.findOne({email : email})

      return userDatabase

    }catch(error){
        console.log(error);
        
    }
 }

 const getOtp = async (userId : string)=>{
      try {
         return await Otp.findOne({userId : userId})
      } catch (error) {
         console.log('Otp not found in database',error)
      }
 }
interface otpData {
   userId : string,
   otp : string,
   createdAt : Date
}

 const findAndUpdateOtp = async (data :otpData)=>{
   try {
      return await Otp.updateOne({userId : data.userId},{$set:{
         createdAt :data.createdAt ,
         otp : data.otp,
         userId : data.userId
        }})
   } catch (error) {
      console.log('Error in updating otp ');
      return
      
   }
 }

 const setVerifiedTrue = async (userId : string)=>{
   try {
      return await User.updateOne({email: userId},{$set: {isVerified : true}})
   } catch (error) {
      
   }
 }
 interface userData {
   email : string,
   fname : string,
   lname : string,
   resume : string,
   experience : string,
  skills : [string]
 }

 const updateUser = async (data : userData)=>{
   try {
      await User.updateOne({email : data.email},{$set :{
          email : data.email,
          fname : data.fname,
          lname : data.lname,
          resume : data.resume,
          experience : data.experience,
         skills : data.skills
      }})
      return {message : 'success'}
   } catch (error) {
      console.log('error in update user in db',error);
      
   }
 }
 export default { 
    findUser,
    getOtp,
    findAndUpdateOtp,
    setVerifiedTrue,
    updateUser
 }

//  async (email : string) =>{
//   try{
//     const userDatabase = await User.aggregate([
//       { $match : {email : email}} ,
//       {$project : {
//           email : 1,
//           "address.address" : 1,
//           "address.city" : 1,
//           "address.state" : 1,
//           "address.PIN" : 1,
//           "address.country" : 1,
//           "subscription.isSubscribed"  : 1,
//          "subscription.plan": 1,
//          "subscription.paymentType" : 1,
//          "subscription.startedAt" : 1,
//           "subscription.expireAt" : 1
//       }}
//     ])