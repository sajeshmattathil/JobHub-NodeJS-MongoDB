import { ObjectId } from "mongodb";
import Job from "../Model/job";
import Otp from "../Model/otp";
import User from "../Model/user";
import hr from "../Model/hr";

try {
} catch (error) {}

const findUser = async (email: string) => {
  try {
    const userDatabase = await User.findOne({ email: email });

    return userDatabase;
  } catch (error) {
    console.log(error);
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
    return await User.updateOne(
      { email: userId },
      { $set: { isVerified: true } }
    );
  } catch (error) {}
};
interface userData {
  email: string;
  fname: string;
  lname: string;
  resume: string;
  experience: string;
  skills: [string];
  educationalQualification: string;
}

const updateUser = async (data: userData, userEmail: string) => {
  try {
    console.log(data, "newUserData----");

    await User.updateOne(
      { email: userEmail },
      {
        $set: {
          fname: data.fname,
          lname: data.lname,
          resume: data.resume,
          experience: data.experience,
          skills: data.skills,
          educationalQualification: data.educationalQualification,
        },
      }
    );
    return { message: "success" };
  } catch (error) {
    console.log("error in update user in db", error);
  }
};

const getJobs = async (pageNumber: number, jobsPerPage: number) => {
  try {
    return await Job.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(jobsPerPage * (pageNumber - 1))
      .limit(jobsPerPage);
  } catch (error) {
    console.error("error in fetching jobs from db for user");
  }
};

const jobCount = async () => {
  try {
    return await Job.countDocuments();
  } catch (error) {
    console.error("error happened in fetching job count in userrepo");
  }
};

interface Body {
  email: string;
  password: string;
  confirm: string;
}

const resetPassword = async (body: Body) => {
  try {
    return await User.updateOne(
      { email: body.email },
      {
        $set: {
          password: body.password,
        },
      }
    );
  } catch (error) {
    console.log("error in resetPassword at repo");
  }
};

const getJobData = async (id: string) => {
  try {
    return await Job.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "hrs",
          localField: "hrObjectId",
          foreignField: "_id",
          as: "jobData",
        },
      },
      {
        $lookup: {
          from: "appliedjobs",
          localField: "_id",
          foreignField: "jobId",
          as: "appliedData",
        },
      },
    ]);
  } catch (error) {
    console.log(error, "error in fetching job data at repo");
  }
};

const addUserEmailInJobPost = async (userEmail: string, jobId: string) => {
  try {
    console.log(userEmail, jobId);

    const newAppliedUser = {
      email: userEmail,
      isShortListed: false,
    };

    return await Job.updateOne(
      { _id: jobId },
      { $push: { appliedUsers: newAppliedUser } }
    );
  } catch (error) {
    console.log(error, "error in updating user email in job post at repo");
    return;
  }
};

const followHR = async (HRId: string, userEmail: string) => {
  try {
    return await hr.updateOne(
      { _id: HRId },
      { $push: { followers: userEmail } }
    );
  } catch (error) {
    console.log(error, "error in follow and unfollow hr at repo");
  }
};

const UnfollowHR = async (HRId: string, userEmail: string) => {
  try {
    return await hr.updateOne(
      { _id: HRId },
      { $pull: { followers: userEmail } }
    );
  } catch (error) {
    console.log(error, "error in follow and unfollow hr at repo");
  }
};
export default {
  findUser,
  getOtp,
  findAndUpdateOtp,
  setVerifiedTrue,
  updateUser,
  getJobs,
  jobCount,
  resetPassword,
  getJobData,
  addUserEmailInJobPost,
  followHR,
  UnfollowHR,
};

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
