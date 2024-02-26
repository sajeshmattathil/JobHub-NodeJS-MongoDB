import { ObjectId } from "mongodb";
import hr from "../Model/hr";
import Hr from "../Model/hr";
import Job from "../Model/job";
import Otp from "../Model/otp";
import appliedJobs from "../Model/appliedJobs";

const findHr = async (email: string) => {
  try {
    return await Hr.findOne({ email: email });
  } catch (error) {
    return null;
  }
};
const findHrById = async (id: string) => {
  try {
    return await Hr.findOne({ _id: id });
  } catch (error) {
    return null;
  }
};

const getOtp = async (userId: string) => {
  try {
    return await Otp.findOne({ userId: userId });
  } catch (error) {
    console.log("Otp not found in database", error);
  }
};
interface otpData {
  userId: string;
  otp: string;
  createdAt: Date;
}

const findAndUpdateOtp = async (data: otpData) => {
  try {
    return await Otp.updateOne(
      { userId: data.userId },
      {
        $set: {
          createdAt: data.createdAt,
          otp: data.otp,
          userId: data.userId,
        },
      }
    );
  } catch (error) {
    console.log("Error in updating otp ");
    return;
  }
};
const setVerifiedTrue = async (userId: string) => {
  try {
    return await hr.updateOne(
      { email: userId },
      { $set: { isVerified: true } }
    );
  } catch (error) {
    console.log(
      error,
      "error happened in setting true for user account in repo"
    );
    return;
  }
};
const getJobsData = async (
  id: ObjectId,
  pageNumber: number,
  jobsPerPage: number
) => {
  try {
    console.log(pageNumber, jobsPerPage, "repo ");

    return await Job.find({ hrObjectId: id })
      .sort({ createdAt: -1 })
      .skip(jobsPerPage * (pageNumber - 1))
      .limit(jobsPerPage);
  } catch (error) {}
};
const jobCount = async (id: ObjectId) => {
  try {
    return await Job.countDocuments({ hrObjectId: id });
  } catch (error) {
    console.error("error happened in fetching job count in userrepo");
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

const updateProfile = async (data: bodyData) => {
  try {
    await hr.updateOne(
      { email: data.email },
      {
        $set: {
          name: data.name,
          company: data.company,
          resume: data.resume,
          experience: data.experience,
          website: data.website,
          employeesNumber: data.employeesNumber,
        },
      }
    );
    return { message: "success" };
  } catch (error) {
    console.log("error in update user in db", error);
    return { message: "failed" };
  }
};

const findSelectedJobData = async (jobId: string) => {
  try {
    console.log(jobId, "id");
    return await appliedJobs.aggregate([
      { $match: { jobId: new ObjectId("65d2eb83a0a5f995c8369cd4") } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobPostData",
        },
      },
    ]);
  } catch (error) {
    console.log(error, "error happened in fetching job data at repo");
    return;
  }
};
export default {
  findHr,
  findHrById,
  getOtp,
  findAndUpdateOtp,
  setVerifiedTrue,
  jobCount,
  getJobsData,
  updateProfile,
  findSelectedJobData,
};
