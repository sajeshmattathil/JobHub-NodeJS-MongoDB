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

    return await Job.find({ hrObjectId: id, isDeleted: false })
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
      { $match: { jobId: new ObjectId(jobId), isDeleted: false } },
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
const deleteJob = async (jobId: string) => {
  try {
    const appliedJobUpdate = await appliedJobs.updateOne(
      { jobId: jobId },
      { $set: { isDeleted: true } }
    );
    const jobUpdate = await Job.updateOne(
      { _id: jobId },
      { $set: { isDeleted: true } }
    );
    return { appliedJobUpdate, jobUpdate };
  } catch (error) {
    console.log(error, "error happened in deleting job at repo");
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
  experience: string;
  salaryScale: string;
  educationalQualification: string;
  education: string;
  course: string;
  industry: string;
  locations: String[];
}
const updateJob = async (body: jobData) => {
  try {
    const updateJob = await Job.updateOne(
      { _id: body.jobId },
      {
        $set: {
          description: body.description,
          qualification: body.qualification,
          company: body.company,
          experience: body.experience,
          salaryScale: body.salaryScale,
          educationalQualification: body.educationalQualification,
          industry: body.industry,
          locations: body.locations,
        },
      }
    );
    if (updateJob) return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log(error, "error happened in updating job at repo");
    return { message: "failed" };
  }
};

const updateJobpostHRViewed = async (jobId: string, HRId: string) => {
  try {
    console.log(jobId, HRId, "job id---->");

    return await appliedJobs.updateOne(
      { jobId: jobId, hrId: HRId },
      { $set: { isHRViewed: true } }
    );
  } catch (error) {
    console.log(error, "error happened in updating job hr viewed at repo");
  }
};

const updateIsShortListed = async (jobId: string, userId: string) => {
  try {
    console.log(userId,'id ---->>>>>>>>>>');
    
    return await Job.updateOne(
      { _id: jobId, "appliedUsers.email": userId },
      {
        $set: { "appliedUsers.$.isShortListed": true },
      }
    );
  } catch (error) {
    console.log(error, "error happened in shortlisting user at repo");
  }
};

const getShortListedUsers = async (jobId: string) => {
  try {
    return await Job.aggregate([
      {
        $match: { _id: new ObjectId(jobId),"appliedUsers.isShortListed" : true },
      },
      {
        $lookup : {
          from : 'users',
          foreignField :'email' ,
          localField : "appliedUsers.email",
          as : 'shortListedUsers'
        }
      },
      {
        $unwind:'$shortListedUsers'
      }
    ]);
  } catch (error) {
    console.log(error, "error happened in getting shortlisted user at repo");
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
  deleteJob,
  updateJob,
  updateJobpostHRViewed,
  updateIsShortListed,
  getShortListedUsers,
};
