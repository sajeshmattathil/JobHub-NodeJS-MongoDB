import { ObjectId } from "mongodb";
import Job from "../Model/job";
import Otp from "../Model/otp";
import User from "../Model/user";
import hr from "../Model/hr";
import plan from "../Model/plan";

try {
} catch (error) {}

const findUser = async (email: string) => {
  console.log(email,'user find repo');
  
  try {
    return  await User.findOne({ email: email });
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
interface searchBody {
  option: string;
  value: string;
}

const getJobs = async (
  pageNumber: number,
  jobsPerPage: number,
  body: searchBody
) => {
  try {
    console.log(body, "body");

    let query: any = { isDeleted: false };

    if (body.option == "location") {
      query.locations = { $in: body.value };
    } else if (body.option == "skills") {
      query.qualification = { $in: body.value };
    } else if (body.option == "jobType") {
      query.jobType = body.value;
    } else if (body.option == "jobRole") {
      query.jobRole = body.value;
    }
    console.log(query, "query");

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(jobsPerPage * (pageNumber - 1))
      .limit(jobsPerPage);

    return jobs;
  } catch (error) {
    console.error("error in fetching jobs from db for user");
  }
};

const jobCount = async (body: searchBody) => {
  try {
    let query: any = { isDeleted: false };

    if (body.option == "location") {
      query.locations = { $in: body.value };
    } else if (body.option == "skills") {
      query.qualification = { $in: body.value };
    } else if (body.option == "jobType") {
      query.jobType = body.value;
    } else if (body.option == "jobRole") {
      query.jobRole = body.value;
    }

    return await Job.countDocuments(query);
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

const getPlans = async () => {
  try {
    return await plan.find({ isActive: true });
  } catch (error) {
    console.log("Error in getting plans at repo", error);
  }
};

interface PaymentBody {
  expireAt: Date | number;
  startedAt: Date;
  duration: number;
  subscribedAt: Date;
  amount: string;
  planName: string;
  razorpayId : string;
}
const savePayment = async (body: PaymentBody, id: string) => {
  try {
    body.startedAt = body.subscribedAt;
    const currentDate = body.subscribedAt;
    const date = new Date(currentDate);
    body.expireAt = date.setDate(date.getDate() + body.duration * 30);

    return await User.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "subscription.isSubscribed": true,
          "subscription.plan": body.planName,
          "subscription.paymentId": body.razorpayId,
          "subscription.amount": body.amount,
          "subscription.startedAt": body.startedAt,
          "subscription.expireAt": body.expireAt,
        },
      }
    );
  } catch (error) {
    console.log("Error in save payment at repo");
  }
};
 
const addUserToPlan = async (planId : string,userEmail : string)=>{
  try {
    console.log(planId,userEmail,'>>>>>')
    return await plan.updateOne({_id : planId},{$push:{users:userEmail}})
  } catch (error) {
    console.log("Error in save add user to plan at repo");
  }
}
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
  getPlans,
  savePayment,
  addUserToPlan
};


