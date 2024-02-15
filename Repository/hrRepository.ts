import { ObjectId } from 'mongodb';
import hr from '../Model/hr';
import Hr from '../Model/hr';
import Job from '../Model/job';
import Otp from '../Model/otp';

const findHr = async (email : string)=>{
    try {
        return await Hr.findOne({email:email})
    } catch (error) {
        return null
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
       return await hr.updateOne({email: userId},{$set: {isVerified : true}})
    } catch (error) {
       
    }
  }
  const getJobsData = async (id: ObjectId,pageNumber : number,jobsPerPage : number)=>{
    try {
      console.log(pageNumber,jobsPerPage,'repo ');
      
        return await Job.find({hrObjectId : id}).sort({createdAt : -1}).skip(jobsPerPage * (pageNumber-1)).limit(jobsPerPage)
    } catch (error) {
        
    }
  }
  const jobCount = async (id: ObjectId)=>{
    try {
       return await Job.countDocuments({hrObjectId : id})
    } catch (error) {
       console.error('error happened in fetching job count in userrepo')
    }
  }
export default {
    findHr,
    getOtp,
    findAndUpdateOtp,
    setVerifiedTrue,
    jobCount,
    getJobsData
}