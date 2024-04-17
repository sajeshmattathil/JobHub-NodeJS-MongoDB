import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import User from "../Model/user";
import userRepository from "../Repository/userRepository";
import Otp from "../Model/otp";
import hrRepository from "../Repository/hrRepository";
import appliedJobs from "../Model/appliedJobs";
import followers from "../Model/followers";
import transaction from "../Model/transactions";

try {
} catch (error) {}

interface ReqBody {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirm: string;
}

const createNewUser = async (user: ReqBody) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 5);
    user.password = hashedPassword;
    const checkExistingUsers = await userRepository.findUser(user.email);

    if (checkExistingUsers?.isVerified) return { status: 409 };
    if (checkExistingUsers?.isVerified === false)
      return { status: 201 };

   const newUser = new User(user);
    
    await newUser.save();
    return { status: 201 };
  } catch (error) {
    return { status: 500 };
  }
};

interface userDetailsInterface {
  _id: ObjectId;
  email: string;
  password: string;
  isBlocked: boolean;
}
interface otp {
  userId: string;
  otp: string;
  createdAt: Date;
}
const saveOtp = async (data: otp) => {
  try {

    const checkUserExists = await userRepository.getOtp(data.userId);
    if (checkUserExists?.userId) {
      const updateOTP = await userRepository.findAndUpdateOtp(data);
      if (updateOTP) return { status: 201 };
    } else {
      const saveOtp = await Otp.create(data);
      return {status: 201 };
    }

    return { status: 406 };
  } catch (error) {
    console.log(error, "error saving otp");
    return {status: 500 };

  }
};

const getSavedOtp = async (userID: string) => {
  try {
    const getOtp = await userRepository.getOtp(userID);
    if (getOtp) return getOtp;
    else return null
  } catch (error) {
    return null
    console.log("Otp not found");
  }
};

const verifyLoginUser = async (user: ReqBody) => {
  try {
    const userDetails: userDetailsInterface | undefined | null =
      await userRepository.findUser(user.email);

    if (userDetails !== undefined && userDetails !== null) {
      const comparePsw = await bcrypt.compare(
        user.password,
        userDetails.password
      );

      if (userDetails && comparePsw && !userDetails.isBlocked) {
        return {
          userData: userDetails.email,
         status :201,
          ObjectId: userDetails._id,
        };
      } else return { userData: null,status:400, message: "Password is incorrect" };
    } else {
      return { userData: null,status:500, message: "No user is found in this email" };
    }
  } catch (error) {
    console.log(error);
    return { userData: null, message: "Something went wrong " };
  }
};

const setVerifiedTrue = async (userId: string) => {
  try {
    const setVerifiedTrue = await userRepository.setVerifiedTrue(userId);
    return {status:200}
  } catch (error) {
    console.log(error, "error in set verified true at user service");
    return {status:500}

  }
};

const getUser = async (id: string) => {
  try {
    const getUser = await userRepository.findUser(id);
    if (getUser)
      return {
        data: getUser,
        message: "success",
      };
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
interface experienceInterface {
  role: string;
  company: string;
  from: Date ;
  to: Date ;
}
interface userData {
  workExperience: experienceInterface[];
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
    const updateUser = await userRepository.updateUser(data, userEmail);

    if (updateUser?.message) return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log("error in updating profile at userservice");
  }
};
interface industryInterface {
  industry: string;
}
interface searchBody {
  industry:industryInterface[]|[] ;
  option: string;
  value: string;
  sort : string;
  salaryPackage: number;

}

const getJobs = async (
  pageNumber: number,
  jobsPerPage: number,
  body: searchBody,
  userEmail: string,
) => {
  try {
    let getUser;
    if (userEmail.trim()) getUser = await userRepository.findUser(userEmail);
    const jobCount = await userRepository.jobCount(
      body,
      getUser?.skills ? getUser.skills : []
    );
    console.log(jobCount, "jobcount");

    const getJobs = await userRepository.getJobs(
      pageNumber,
      jobsPerPage,
      body,
      getUser?.skills ? getUser.skills : []
    );
    if (getJobs !== undefined) {
      if (getJobs.length)
        return { data: getJobs, totalPages: jobCount, message: "success" };
      else return { data: null, message: "no data" };
    } else return { data: null, totalPages: null, message: "failed" };
  } catch (error) {
    console.log("error in fetching jobs by user");
  }
};
const checkUserExists = async (userId: string) => {
  try {
    const findUser = await userRepository.findUser(userId);
    if (findUser !== undefined) {
      if (findUser !== null) {
        if (findUser.email) {
          return { message: "user exists" };
        } else {
          return { message: "user not found" };
        }
      }
    }
    return { message: "user not found" };
  } catch (error) {
    console.log(
      "error happened in verifyin userId is existing or not for forgot password in Controller"
    );
  }
};
interface Body {
  email: string;
  password: string;
  confirm: string;
}

const resetPassword = async (body: Body) => {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 15);
    body.password = hashedPassword;
    const resetPassword = await userRepository.resetPassword(body);
    return { message: "success" };
  } catch (error) {
    console.log("error in resetPassword at userService");
    return { message: "failed" };
  }
};

const getJobData = async (id: string) => {
  try {
    const data = await userRepository.getJobData(id);
    console.log(data, "data---job");

    if (data && data.length) {
      return { message: "success", data: data };
    } else {
      return {
        message: "failed ",
        data: null,
      };
    }
  } catch (error) {
    console.log(error, "error in fetching job data at user service");
  }
};
interface appliedJobBody {
  jobId: string;
  hrId: string;
  appliedAt: Date;
  userId?: string;
  userEmail: string;
}
const saveAppliedJob = async (body: appliedJobBody) => {
  try {
    console.log(body, "bodyyyyy");
    const newJob = new appliedJobs(body);
    newJob.save();
    const x = await userRepository.addUserEmailInJobPost(
      body.userEmail,
      body.jobId
    );
    console.log(x, "xxx");

    return { message: "success", appliedJob: newJob };
  } catch (error) {
    console.log(error, "error happened in saving applied jobs at service");
    return { message: "failed", appliedJob: null };
  }
};
const followAndUnfollow = async (
  hrID: string,
  value: string,
  userID: string
) => {
  try {
    if (value == "follow+") {
      const newFollower =new followers({hrID,userID})
      newFollower.save()
    } else {
      await userRepository.UnfollowHR(hrID, userID);
    }
    return { message: "success" };
  } catch (error) {
    console.log(error, "error in follow and unfollow hr at service");
    return { message: "failed" };
  }
};

const getPlans = async () => {
  try {
    const getPlanDatas = await userRepository.getPlans();
    console.log(getPlanDatas, "data-- plan");
    if (getPlanDatas && getPlanDatas.length) {
      return {
        message: "success",
        data: getPlanDatas,
      };
    } else {
      return {
        message: "failed",
        data: null,
      };
    }
  } catch (error) {
    console.log("Error in get new plan at adminservice", error);
    return {
      message: "failed",
      data: null,
    };
  }
};
interface PaymentBody {
  planId: string;
  planName: string;
  amount: string;
  duration: number;
  subscribedAt: Date;
  expireAt: Date;
  startedAt: Date;
  razorpayId: string;
  time ?:Date
}

const savePayment = async (
  body: PaymentBody,
  id: string,
  userEmail: string
) => {
  try {
    await userRepository.addUserToPlan(body.planId, userEmail);
    const updatePayment = await userRepository.savePayment(body, id);
    body.time = body.startedAt
    const newTransaction = new transaction(body)
    newTransaction.save()
    if (updatePayment && updatePayment.modifiedCount !== 0 && newTransaction?._id) return true;
    else return false;
  } catch (error) {
    console.log("Error in save payment adminservice", error);
    return false
  }
};
const getPrevChatUsers = async (userEmail: string) => {
  try {
    const usersData = await userRepository.getPrevChatUsers(userEmail);
    const lastChat = await userRepository.getLastMsg(usersData, userEmail);
    interface resultInterface {
      text: string | null | undefined;
      name: string | null | undefined;
    }
    let result: resultInterface[] | null = [];
    if (usersData && lastChat) {
      for (let user of usersData) {
        let time = Date.now();
        for (let chat of lastChat) {
          if (chat.recipient1 === user) {
            result.push({ text: chat.text, name: chat.recipient1 });
            break;
          }
        }
      }
    }
    if (usersData && usersData.length && result)
      return { success: true, data: result };
    else return { success: false, data: null };
  } catch (error) {
    return { success: false, data: null };
  }
};

export default {
  createNewUser,
  saveOtp,
  getSavedOtp,
  setVerifiedTrue,
  verifyLoginUser,
  checkUserExists,
  getUser,
  updateUser,
  getJobs,
  resetPassword,
  getJobData,
  saveAppliedJob,
  followAndUnfollow,
  getPlans,
  savePayment,
  getPrevChatUsers,
};
