 import User from "../Model/user"
 
 interface ReqBody {
    email : string ,
    password : string ,
    confirm : string
}

const createNewUser =async (user :ReqBody)=>{
  try{
    console.log(user,'******');
    
  const userc = await User.create(user)
       if(userc) {
        console.log(1111);
        return {status : 201} 
       }
  }catch(error){
      return {status : 500}
  }
}

export default {createNewUser}