import { ObjectId } from "mongodb";
import Admin from "../Model/admin";
import Hr from "../Model/hr";
import plan from "../Model/plan";
import User from "../Model/user";

const findAdmin = async (email: string) => {
  try {
    const adminData = await Admin.findOne({ email: email });
    console.log(adminData, "ddddd");

    return adminData;
  } catch (error) {
    console.log(error);
  }
};
const getAllUsers = async () => {
  try {
    return await User.find({ isVerified: true });
  } catch (error) {
    console.log("Data of all users not found");
    return;
  }
};

const blockUblockUser = async (email: string, isBlocked: boolean) => {
  try {
    return await User.updateOne(
      { email: email },
      { $set: { isBlocked: !isBlocked } }
    );
  } catch (error) {
    console.log("Error in blocking user", error);
  }
};
const getHiringManagers = async (pageNumber: number, HRsPerPage: number) => {
  try {
    return await Hr.find({ isApproved: false })
      .skip(HRsPerPage * (pageNumber - 1))
      .limit(HRsPerPage);
  } catch (error) {
    console.log("error happend in fetching hiringmanagers data in repo ");
  }
};

const HRCount = async () => {
  try {
    return await Hr.countDocuments({ isApproved: false });
  } catch (error) {
    console.error("error happened in fetching job count in userrepo");
  }
};
const getHiringManagersApproved = async (
  pageNumber: number,
  HRsPerPage: number
) => {
  try {
    return await Hr.find({ isApproved: true })
      .skip(HRsPerPage * (pageNumber - 1))
      .limit(HRsPerPage);
  } catch (error) {
    console.log("error happend in fetching hiringmanagers data in repo ");
  }
};

const HRCountApproved = async () => {
  try {
    return await Hr.countDocuments({ isApproved: true });
  } catch (error) {
    console.error("error happened in fetching job count in userrepo");
  }
};

const blockUblockHR = async (email: string, isBlocked: boolean) => {
  try {
    return await Hr.updateOne(
      { email: email },
      { $set: { isBlocked: !isBlocked } }
    );
  } catch (error) {
    console.log("Error in blocking hr", error);
  }
};
const hrApprove = async (email: string) => {
  try {
    return await Hr.updateOne({ email: email }, { $set: { isApproved: true } });
  } catch (error) {
    console.log("Error in approve hr", error);
  }
};

const getPlans = async () => {
  try {
    return await plan.find({ isActive: true });
  } catch (error) {
    console.log("Error in getting plans at repo", error);
  }
};

const getPlanData = async (planId: string) => {
  try {
    return await plan.findOne({ _id: new ObjectId(planId) });
  } catch (error) {
    console.log("Error in getting plan at repo", error);
  }
};
interface updatedPlan {
  amount: string;
  duration: string;
  planName: string;
}
const updatePlan = async (planId: string, body: updatedPlan) => {
  try {
    return await plan.updateOne(
      { _id: planId },
      {
        $set: {
          amount: body.amount,
          planName: body.planName,
          duration: body.duration,
        },
      }
    );
  } catch (error) {
    console.log("Error in updating plan at repo", error);
  }
};

const deletePlan = async (id: string) => {
  try {
    return await plan.updateOne(
      { _id: id },
      {
        $set: {
          isActive: false,
        },
      }
    );
  } catch (error) {
    console.log("Error in deleting plan at repo", error);
  }
};
export default {
  findAdmin,
  getAllUsers,
  blockUblockUser,
  getHiringManagers,
  getHiringManagersApproved,
  blockUblockHR,
  hrApprove,
  HRCountApproved,
  HRCount,
  getPlans,
  getPlanData,
  updatePlan,
  deletePlan,
};
