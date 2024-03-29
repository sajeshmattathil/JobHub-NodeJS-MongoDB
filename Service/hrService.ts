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
      console.log(decryptedPassword,verifyHrData,'hr datas- login');
      
      if (decryptedPassword) return { message: "verified", data: verifyHrData };
      else return { message: "declained", data: null };
    } else return { message: "no user found", data: null };
  } catch (error) {
    return { message: "", data: null };
  }
};
interface jobData {
  jobId?: ObjectId | undefined;
  jobRole: string;
  description: string;
  qualification: string[];
  salaryFrom: string;
  salaryTo: string;
  company: string;
  createdBy: string;
  experience: string;
  hrObjectId: ObjectId;
  salaryScale: string;
  educationalQualification: string;
  education: string;
  course: string;
  industry: string;
  locations: String[];
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
    if (getHR && getHR?.password !== undefined) {
      getHR.password = "";
      return {
        data: getHR,
        message: "success",
      };
    } else
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
  name: string;
  company: string;
  website: string;
  resume: string;
  employeesNumber: number;
  experience: number;
  email: string;
}

const updateProfile = async (HRData: bodyData) => {
  try {
    const updateUser = await hrRepository.updateProfile(HRData);
    if (updateUser?.message) return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log("error in updating profile at userservice");
  }
};

const getJobDetails = async (jobId: string) => {
  try {
    const getData: any = await hrRepository.findSelectedJobData(jobId);

    if (getData && getData.length) return { message: "success", data: getData };
    else return { messag: "failed", data: null };
  } catch (error) {
    console.log(error, "error happened in fetching job data at hr service");
    return { message: "failed", data: null };
  }
};

const deleteJob = async (jobId: string) => {
  try {
    const deleteJobData = await hrRepository.deleteJob(jobId);
    console.log(deleteJobData, "deletjondata----");
    return { message: "success" };
  } catch (error) {
    console.log(error, "error happened in deleting job in hr service");
    return { message: "failed" };
  }
};

const updateJob = async (body: jobData) => {
  try {
    const updatedResult = await hrRepository.updateJob(body);
    console.log(updatedResult, "result-----");
    if (updatedResult.message == "success") return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log(error, "error happened in updating job in hr service");
  }
};

const updateJobpostHRViewed = async (jobId: string, HRId: string) => {
  try {
    const updateHRViewed = await hrRepository.updateJobpostHRViewed(
      jobId,
      HRId
    );
    console.log(updateHRViewed, "updtate job service");
    return { message: "success" };
  } catch (error) {
    console.log(
      error,
      "error happened in updating job hr viewed in hr service"
    );
    return { message: "failed" };
  }
};

const shortListUser = async (jobId: string, userId: string) => {
  try {
    const updateShortListedTrue = await hrRepository.updateIsShortListed(
      jobId,
      userId
    );
    console.log(updateShortListedTrue,'updateShortListedTrue');
    
    if (updateShortListedTrue) return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log(error, "error happened in shortlist user in hr service");
    return { message: "failed" };
  }
};

const getShortListedUsers = async (jobId : string) =>{
  try {
    const shortListedData = await hrRepository.getShortListedUsers(jobId)
    console.log(shortListedData,'shortListedData');
    if(shortListedData && shortListedData.length) return {message : 'success',data : shortListedData}
    else return {message : 'failed',data : null}
  } catch (error) {
    console.log(error, "error happened in gettind shortlist user in hr service");
    return {message : 'failed',data : null}
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
  updateProfile,
  getJobDetails,
  deleteJob,
  updateJob,
  updateJobpostHRViewed,
  shortListUser,
  getShortListedUsers
};
