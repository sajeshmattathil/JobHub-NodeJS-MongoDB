import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import adminRepository from "../Repository/adminRepository";
import plan from "../Model/plan";

interface loginBody {
  email: string;
  password: string;
}

interface adminDetailsInterface {
  _id: ObjectId;
  email: string;
  password: string;
}

const verifyLoginAdmin = async (body: loginBody) => {
  try {
    const adminDetails: adminDetailsInterface | undefined | null =
      await adminRepository.findAdmin(body.email);

    if (adminDetails !== undefined && adminDetails !== null) {
      const comparePsw = await bcrypt.compare(
        body.password,
        adminDetails.password
      );
      console.log(comparePsw, "companre");

      if (adminDetails && comparePsw)
        return { adminData: adminDetails.email, message: "Admin verified" };
      else return { adminData: null, message: "Password is incorrect" };
    } else {
      return { adminData: null, message: "No user is found in this email" };
    }
  } catch (error) {
    console.log(error);
    return { adminData: null, message: "Something went wrong " };
  }
};

const getAllUsers = async () => {
  try {
    const getAllUsers = await adminRepository.getAllUsers();
    if (getAllUsers) return getAllUsers;
  } catch (error) {
    console.log("Users data is not found");
    return;
  }
};

const blockUblockUser = async (email: string, isBlocked: boolean) => {
  try {
    const blockUblockUser = await adminRepository.blockUblockUser(
      email,
      isBlocked
    );
    console.log(blockUblockUser, "blockUblockUser");
    if (blockUblockUser) return { message: true };
    else return { message: null };
  } catch (error) {
    console.log("Error in block n unblock", error);
    return { message: null };
  }
};
const getHiringManagers = async (pageNumber: number, HRsPerPage: number) => {
  try {
    const HRCount = await adminRepository.HRCount();
    console.log(HRCount, "jobCount1");
    const getHiringManagers = await adminRepository.getHiringManagers(
      pageNumber,
      HRsPerPage
    );
    if (getHiringManagers !== undefined) {
      if (getHiringManagers.length)
        return {
          message: "success",
          data: getHiringManagers,
          totalPages: HRCount,
        };
    } else {
      return { message: "failed", data: null, totalPages: null };
    }
  } catch (error) {
    console.log(
      "error happened in fetching hiring managers data in adminService"
    );
  }
};

const getHiringManagersApproved = async (
  pageNumber: number,
  HRsPerPage: number
) => {
  try {
    const HRCount = await adminRepository.HRCountApproved();
    console.log(HRCount, "jobCount2");
    const getHiringManagers = await adminRepository.getHiringManagersApproved(
      pageNumber,
      HRsPerPage
    );
    if (getHiringManagers !== undefined) {
      if (getHiringManagers.length)
        return {
          message: "success",
          data: getHiringManagers,
          totalPages: HRCount,
        };
    } else {
      return { message: "failed", data: null, totalPages: null };
    }
  } catch (error) {
    console.log(
      "error happened in fetching hiring managers data in adminService"
    );
  }
};

const blockUnblockHR = async (email: string, isBlocked: boolean) => {
  try {
    const blockUblockHR = await adminRepository.blockUblockHR(email, isBlocked);
    console.log(blockUblockHR, "blockUblockUser");
    if (blockUblockHR) return { message: true };
    else return { message: null };
  } catch (error) {
    console.log("Error in block n unblock", error);
    return { message: null };
  }
};
const hrApprove = async (email: string) => {
  try {
    const hrApprove = await adminRepository.hrApprove(email);
    console.log(hrApprove, "hrApprove");
    if (hrApprove) return { message: true };
    else return { message: null };
  } catch (error) {
    console.log("Error in hrApprove", error);
    return { message: null };
  }
};
const getAdmin = async (id: string) => {
  try {
    const adminData = await adminRepository.findAdmin(id);
    if (adminData && adminData?.password !== undefined) {
      adminData.password = "";
      return {
        data: adminData,
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

const saveNewPlan = async (body: any) => {
  try {
    const newPlan = new plan(body);
    await newPlan.save();
    if (newPlan) return { message: "success" };
    else return { message: "failed" };
  } catch (error) {
    console.log("Error in save new plan at adminservice", error);
    return { message: "failed" };
  }
};

const getPlans = async () => {
  try {
    const getPlanDatas = await adminRepository.getPlans();
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

const getPlanData = async (planId: string) => {
  try {
    const getPlanData = await adminRepository.getPlanData(planId);
    console.log(getPlanData, "plandata---");

    if (getPlanData && Object.keys(getPlanData).length) {
      return {
        message: "success",
        data: getPlanData,
      };
    } else
      return {
        message: "failed",
        data: null,
      };
  } catch (error) {
    console.log("Error in get  plan at adminservice", error);
    return {
      message: "failed",
      data: null,
    };
  }
};

interface updatedPlan {
  amount: string;
  duration: string;
  planName: string;
}
const updatePlan = async (planId: string, body: updatedPlan) => {
  try {
    const getUpdatedData = await adminRepository.updatePlan(planId, body);
    console.log(getUpdatedData, "getupdated data----");

    console.log(getUpdatedData, "plandata---");

    if (getUpdatedData) {
      return {
        message: "success",
      };
    } else
      return {
        message: "failed",
      };
  } catch (error) {
    console.log("Error in update  plan at adminservice", error);
    return {
      message: "failed",
    };
  }
};

const deletePlan = async (id: string) => {
  try {
    const getDeletedData = await adminRepository.deletePlan(id);
    console.log(getDeletedData, "getupdated data----");

    console.log(getDeletedData, "plandata---");

    if (getDeletedData) {
      return {
        message: "success",
      };
    } else
      return {
        message: "failed",
      };
  } catch (error) {
    console.log("Error in delete  plan at adminservice", error);
    return {
      message: "failed",
    };
  }
};
const getAllDashboardData = async () => {
  try {
    const [
      totalNumberOfUsers,
      totalNumberOfHR,
      totalActiveSubscribers,
      totalRevenueGenerated,
    ] = await Promise.all([
      adminRepository.findUsersTotal(),
      adminRepository.findHRTotal(),
      adminRepository.findTotalActiveSubcribers(),
      adminRepository.findTotalRevenueGenerated(),
    ]);

    if (
      totalNumberOfUsers !== null &&
      totalNumberOfHR !== null &&
      totalActiveSubscribers !== null &&
      totalRevenueGenerated !== null
    ) {
      return {
        success: true,
        data: {
          totalUsers: totalNumberOfUsers,
          totalHR: totalNumberOfHR,
          activeSubscribers: totalActiveSubscribers,
          totalRevenue: totalRevenueGenerated[0].totalAmount,
        },
      };
    } else {
      return {
        success: false,
        error: "Some data could not be retrieved",
      };
    }
  } catch (error) {
    console.error("Error in getAllDashboardData:", error);
    return {
      success: false,
      error: "An error occurred while fetching data",
    };
  }
};

export default {
  getAdmin,
  verifyLoginAdmin,
  getAllUsers,
  blockUblockUser,
  getHiringManagers,
  getHiringManagersApproved,
  blockUnblockHR,
  hrApprove,
  saveNewPlan,
  getPlans,
  getPlanData,
  updatePlan,
  deletePlan,
  getAllDashboardData,
};
