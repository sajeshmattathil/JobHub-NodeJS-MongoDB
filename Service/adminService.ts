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
      if (adminDetails && comparePsw)
        return { adminData: adminDetails.email, status : 201};
      else return { adminData: null, status : 401 };
    } else {
      return { adminData: null, status:404 };
    }
  } catch (error) {
    console.log(error);
    return { adminData: null, status:500 };
  }
};

const getAllUsers = async () => {
  try {
    const getAllUsers = await adminRepository.getAllUsers();
    if (getAllUsers?.length){ return {
      status : 201,
      data : getAllUsers
    }} else{
      return {
        status:404,
        data: null
      }
    }
  } catch (error) {
    return {
      status:500,
      data: null
    }
  }
};

const blockUblockUser = async (email: string, isBlocked: boolean) => {
  try {
    const blockUblockUser = await adminRepository.blockUblockUser(
      email,
      isBlocked
    );
    console.log(blockUblockUser, "blockUblockUser");
    if (blockUblockUser) return { status : 201 };
    else return { status : 404 };
  } catch (error) {
    console.log("Error in block n unblock", error);
    return { status : 500 };
  }
};
const getHiringManagers = async (pageNumber: number, HRsPerPage: number) => {
  try {
    const HRCount = await adminRepository.HRCount();
    const getHiringManagers = await adminRepository.getHiringManagers(
      pageNumber,
      HRsPerPage
    );
    if (getHiringManagers !== undefined) {
      if (getHiringManagers.length)
        return {
          status : 201,
          data: getHiringManagers,
          totalPages: HRCount,
        };
    } else {
      return { status : 404, data: null, totalPages: null };
    }
  } catch (error) {
    return { status : 500, data: null, totalPages: null };

  }
};

const getHiringManagersApproved = async (
  pageNumber: number,
  HRsPerPage: number
) => {
  try {
    const HRCount = await adminRepository.HRCountApproved();
    const getHiringManagers = await adminRepository.getHiringManagersApproved(
      pageNumber,
      HRsPerPage
    );
    if (getHiringManagers !== undefined) {
      if (getHiringManagers.length)
        return {
          status : 201,
          data: getHiringManagers,
          totalPages: HRCount,
        };
    } else {
      return { status : 404, data: null, totalPages: null };
    }
  } catch (error) {
    return { status : 500, data: null, totalPages: null };

  }
};

const blockUnblockHR = async (email: string, isBlocked: boolean) => {
  try {
    const blockUblockHR = await adminRepository.blockUblockHR(email, isBlocked);
    if (blockUblockHR) return { status : 201 };
    else return { status : 404 };
  } catch (error) {
    return { status : 500};
  }
};
const hrApprove = async (email: string) => {
  try {
    const hrApprove = await adminRepository.hrApprove(email);
    if (hrApprove) return { status : 201};
    else return { status : 404};
  } catch (error) {
    return { status : 500 };
  }
};
const getAdmin = async (id: string) => {
  try {
    const adminData = await adminRepository.findAdmin(id);
    if (adminData && adminData?.password !== undefined) {
      adminData.password = "";
      return {
        data: adminData,
        status : 201,
      };
    } else
      return {
        data: null,
        status : 404,
      };
  } catch (error) {
    return {
      data: null,
      status : 500,
    };
  }
};

const saveNewPlan = async (body: any) => {
  try {
    const newPlan = new plan(body);
    await newPlan.save();
    if (newPlan) return { status : 200};
    else return { status : 400};
  } catch (error) {
    return {  status : 500 };
  }
};

const getPlans = async () => {
  try {
    const getPlanDatas = await adminRepository.getPlans();
    console.log(getPlanDatas, "data-- plan");
    if (getPlanDatas && getPlanDatas.length) {
      return {
        status : 201,
        data: getPlanDatas,
      };
    } else {
      return {
        status : 404,
        data: null,
      };
    }
  } catch (error) {
    return {
      status : 500,
      data: null,
    };
  }
};

const getPlanData = async (planId: string) => {
  try {
    const getPlanData = await adminRepository.getPlanData(planId);
    if (getPlanData && Object.keys(getPlanData).length) {
      return {
        status : 201,
        data: getPlanData,
      };
    } else
      return {
        status : 400,
        data: null,
      };
  } catch (error) {
    return {
      status : 500,
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
    if (getUpdatedData) {
      return {
        status : 201,
      };
    } else
      return {
        status : 400,
      };
  } catch (error) {
    return {
      status : 500,
    };
  }
};

const deletePlan = async (id: string) => {
  try {
    const getDeletedData = await adminRepository.deletePlan(id);
    if (getDeletedData) {
      return {
        status : 201,
      };
    } else
      return {
        status : 400,
      };
  } catch (error) {
    return {
      status : 500,
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
        status :202,
        data: {
          totalUsers: totalNumberOfUsers,
          totalHR: totalNumberOfHR,
          activeSubscribers: totalActiveSubscribers,
          totalRevenue: totalRevenueGenerated[0].totalAmount,
        },
      };
    } else {
      return {
        status :404,
        error: "Some data could not be retrieved",
      };
    }
  } catch (error) {
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
