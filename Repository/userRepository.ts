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

 export default { 
    findUser
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