"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminRepository_1 = __importDefault(require("../Repository/adminRepository"));
const plan_1 = __importDefault(require("../Model/plan"));
const verifyLoginAdmin = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminDetails = yield adminRepository_1.default.findAdmin(body.email);
        if (adminDetails !== undefined && adminDetails !== null) {
            const comparePsw = yield bcrypt_1.default.compare(body.password, adminDetails.password);
            if (adminDetails && comparePsw)
                return { adminData: adminDetails.email, status: 201 };
            else
                return { adminData: null, status: 401 };
        }
        else {
            return { adminData: null, status: 404 };
        }
    }
    catch (error) {
        console.log(error);
        return { adminData: null, status: 500 };
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllUsers = yield adminRepository_1.default.getAllUsers();
        if (getAllUsers === null || getAllUsers === void 0 ? void 0 : getAllUsers.length) {
            return {
                status: 201,
                data: getAllUsers
            };
        }
        else {
            return {
                status: 404,
                data: null
            };
        }
    }
    catch (error) {
        return {
            status: 500,
            data: null
        };
    }
});
const blockUblockUser = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blockUblockUser = yield adminRepository_1.default.blockUblockUser(email, isBlocked);
        console.log(blockUblockUser, "blockUblockUser");
        if (blockUblockUser)
            return { status: 201 };
        else
            return { status: 404 };
    }
    catch (error) {
        console.log("Error in block n unblock", error);
        return { status: 500 };
    }
});
const getHiringManagers = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const HRCount = yield adminRepository_1.default.HRCount();
        const getHiringManagers = yield adminRepository_1.default.getHiringManagers(pageNumber, HRsPerPage);
        if (getHiringManagers !== undefined) {
            if (getHiringManagers.length)
                return {
                    status: 201,
                    data: getHiringManagers,
                    totalPages: HRCount,
                };
        }
        else {
            return { status: 404, data: null, totalPages: null };
        }
    }
    catch (error) {
        return { status: 500, data: null, totalPages: null };
    }
});
const getHiringManagersApproved = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const HRCount = yield adminRepository_1.default.HRCountApproved();
        const getHiringManagers = yield adminRepository_1.default.getHiringManagersApproved(pageNumber, HRsPerPage);
        if (getHiringManagers !== undefined) {
            if (getHiringManagers.length)
                return {
                    status: 201,
                    data: getHiringManagers,
                    totalPages: HRCount,
                };
        }
        else {
            return { status: 404, data: null, totalPages: null };
        }
    }
    catch (error) {
        return { status: 500, data: null, totalPages: null };
    }
});
const blockUnblockHR = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blockUblockHR = yield adminRepository_1.default.blockUblockHR(email, isBlocked);
        if (blockUblockHR)
            return { status: 201 };
        else
            return { status: 404 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const hrApprove = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hrApprove = yield adminRepository_1.default.hrApprove(email);
        if (hrApprove)
            return { status: 201 };
        else
            return { status: 404 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const getAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield adminRepository_1.default.findAdmin(id);
        if (adminData && (adminData === null || adminData === void 0 ? void 0 : adminData.password) !== undefined) {
            adminData.password = "";
            return {
                data: adminData,
                status: 201,
            };
        }
        else
            return {
                data: null,
                status: 404,
            };
    }
    catch (error) {
        return {
            data: null,
            status: 500,
        };
    }
});
const saveNewPlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPlan = new plan_1.default(body);
        yield newPlan.save();
        if (newPlan)
            return { status: 200 };
        else
            return { status: 400 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const getPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanDatas = yield adminRepository_1.default.getPlans();
        console.log(getPlanDatas, "data-- plan");
        if (getPlanDatas && getPlanDatas.length) {
            return {
                status: 201,
                data: getPlanDatas,
            };
        }
        else {
            return {
                status: 404,
                data: null,
            };
        }
    }
    catch (error) {
        return {
            status: 500,
            data: null,
        };
    }
});
const getPlanData = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanData = yield adminRepository_1.default.getPlanData(planId);
        if (getPlanData && Object.keys(getPlanData).length) {
            return {
                status: 201,
                data: getPlanData,
            };
        }
        else
            return {
                status: 400,
                data: null,
            };
    }
    catch (error) {
        return {
            status: 500,
            data: null,
        };
    }
});
const updatePlan = (planId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUpdatedData = yield adminRepository_1.default.updatePlan(planId, body);
        if (getUpdatedData) {
            return {
                status: 201,
            };
        }
        else
            return {
                status: 400,
            };
    }
    catch (error) {
        return {
            status: 500,
        };
    }
});
const deletePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDeletedData = yield adminRepository_1.default.deletePlan(id);
        if (getDeletedData) {
            return {
                status: 201,
            };
        }
        else
            return {
                status: 400,
            };
    }
    catch (error) {
        return {
            status: 500,
        };
    }
});
const getAllDashboardData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalNumberOfUsers, totalNumberOfHR, totalActiveSubscribers, totalRevenueGenerated,] = yield Promise.all([
            adminRepository_1.default.findUsersTotal(),
            adminRepository_1.default.findHRTotal(),
            adminRepository_1.default.findTotalActiveSubcribers(),
            adminRepository_1.default.findTotalRevenueGenerated(),
        ]);
        if (totalNumberOfUsers !== null &&
            totalNumberOfHR !== null &&
            totalActiveSubscribers !== null &&
            totalRevenueGenerated !== null) {
            return {
                status: 202,
                data: {
                    totalUsers: totalNumberOfUsers,
                    totalHR: totalNumberOfHR,
                    activeSubscribers: totalActiveSubscribers,
                    totalRevenue: totalRevenueGenerated[0].totalAmount,
                },
            };
        }
        else {
            return {
                status: 404,
                error: "Some data could not be retrieved",
            };
        }
    }
    catch (error) {
        return {
            success: false,
            error: "An error occurred while fetching data",
        };
    }
});
exports.default = {
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
