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
  hrObjectId: ObjectId;
}

const saveJob = async (data: jobData) => {
  try {
    const hrObjectId = await hrRepository.findHr(data.createdBy);
    if (hrObjectId) data.hrObjectId = hrObjectId?._id;
    const job = new Job(data);
    await job.save();
    return { message: "success" };
  } catch (error) {
    return { message: "failed" };
  }
};
const getJobsData = async (hrEmail: string) => {
  try {
    const hrData = await hrRepository.findHr(hrEmail);
    
    if (  hrData !== null  && Object.keys(hrData).length) {
      const getJobsData = await hrRepository.getJobsData(hrData._id);
      
      if (getJobsData != undefined) {
        if (getJobsData.length) return { data: getJobsData, message: "" };
        else return { data: null, message: "No jobs found" };
      }
    }
  } catch (error) {
    return { data: null, message: "error" };
  }
};
export default {
  saveHrData,
  saveOtp,
  getSavedOtp,
  setVerifiedTrue,
  verifyHrData,
  saveJob,
  getJobsData,
};
