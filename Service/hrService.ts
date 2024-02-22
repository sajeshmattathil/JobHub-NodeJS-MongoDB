import { ObjectId } from "mongodb";
import Hr from "../Model/hr";
import Job from "../Model/job";
import Otp from "../Model/otp";
import hrRepository from "../Repository/hrRepository";
import bcrypt from "bcrypt";

interface hrInputData {
  name: string;
  email: string;
  password: string;
  resume: string;
  company: string;
  website: string;
}
const saveHrData = async (data: hrInputData) => {
  bcrypt;
  try {
    const hashedPassword = await bcrypt.hash(data.password, 5);
    data.password = hashedPassword;
    const checkExistingHr = await hrRepository.findHr(data.email);
    if (checkExistingHr) return { message: "exists" };
    const hrData = new Hr(data);
    await hrData.save();
    return { message: "saved" };
  } catch (error) {
    console.log(error, "");
  }
};
interface otp {
  userId: string;
  otp: string;
  createdAt: Date;
}
const saveOtp = async (data: otp) => {
  try {
    console.log(data, "saveOtp");

    const checkUserExists = await hrRepository.getOtp(data.userId);
    console.log(checkUserExists, "checkUserExists");
    if (checkUserExists) {
      await hrRepository.findAndUpdateOtp(data);
    } else {
      const saveOtp = await Otp.create(data);
      console.log(saveOtp, ">>>>");
    }

    return;
  } catch (error) {}
};
const getSavedOtp = async (userID: string) => {
  try {
    const getOtp = await hrRepository.getOtp(userID);
    if (getOtp) return getOtp;
    else return;
  } catch (error) {
    console.log("Otp not found");
  }
};
const setVerifiedTrue = async (userId: string) => {
  try {
    const setVerifiedTrue = await hrRepository.setVerifiedTrue(userId);
  } catch (error) {}
};

interface hrLoginData {
  email: string;
  password: string;
}
const verifyHrData = async (data: hrLoginData) => {
  try {
    const verifyHrData = await hrRepository.findHr(data.email);
    if (verifyHrData) {
      const decryptedPassword = await bcrypt.compare(
        data.password,
        verifyHrData.password
      );
      if (decryptedPassword) return { message: "verified", data: verifyHrData };
      else return { message: "declained ", data: null };
    } else return { message: "no user found", data: null };
  } catch (error) {
    return { message: "", data: null };
  }
};
interface jobData {
  jobRole: string;
  description: string;
  qualification: string;
  salaryFrom: string;
  salaryTo: string;
  company: string;
  createdBy: string;
  experience : string;
  hrObjectId: ObjectId;
  salaryScale : string;
  educationalQualification : string;
  education : string;
  course : string;
  industry : string;


}

const saveJob = async (data: jobData) => {
  try {
    const hrObjectId = await hrRepository.findHr(data.createdBy);
    if (hrObjectId) data.hrObjectId = hrObjectId?._id;
    console.log(hrObjectId, "obid");

    const job = new Job(data);
    await job.save();
    return { message: "success" };
  } catch (error) {
    console.log(error, "error--createjob");

    return { message: "failed" };
  }
};
const getJobsData = async (
  hrEmail: string,
  pageNumber: number,
  jobsPerPage: number
) => {
  try {
    const hrData = await hrRepository.findHr(hrEmail);
    if (hrData !== null && Object.keys(hrData).length) {
      const getJobsData = await hrRepository.getJobsData(
        hrData._id,
        pageNumber,
        jobsPerPage
      );
      const jobCount = await hrRepository.jobCount(hrData._id);
      // console.log(getJobsData,jobCount,'service---');

      if (getJobsData != undefined) {
        if (getJobsData.length)
          return { data: getJobsData, totalPages: jobCount, message: "" };
        else return { data: null, totalPages: null, message: "No jobs found" };
      }
    }
  } catch (error) {
    return { data: null, message: "error" };
  }
};

const getHR = async (id: string) => {
  try {
    const getHR = await hrRepository.findHr(id);
    if (getHR && getHR?.password !== undefined){
    getHR.password = ''
      return {
        data: getHR,
        message: "success",
      };
    }
    
    else
      return {
        data: null,
        message: "Not found",
      };
  } catch (error) {
    return {
      data: null,
      message: "error",
    };
  }
};

interface bodyData {
    name : string,
    company : string;
    website : string;
  resume : string;
  employeesNumber : number;
  experience : number;
  email : string;
  
}

const updateProfile = async (HRData : bodyData)=>{
  try {
    const updateUser = await hrRepository.updateProfile(HRData)
   if (updateUser?.message) return {message : 'success'}
   else return { message : 'failed'}
    
  } catch (error) {
    console.log('error in updating profile at userservice');
    
  }
}
export default {
  saveHrData,
  saveOtp,
  getSavedOtp,
  setVerifiedTrue,
  verifyHrData,
  saveJob,
  getJobsData,
  getHR,
  updateProfile
};
