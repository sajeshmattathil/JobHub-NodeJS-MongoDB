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
            console.log(comparePsw, "companre");
            if (adminDetails && comparePsw)
                return { adminData: adminDetails.email, message: "Admin verified" };
            else
                return { adminData: null, message: "Password is incorrect" };
        }
        else {
            return { adminData: null, message: "No user is found in this email" };
        }
    }
    catch (error) {
        console.log(error);
        return { adminData: null, message: "Something went wrong " };
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllUsers = yield adminRepository_1.default.getAllUsers();
        if (getAllUsers)
            return getAllUsers;
    }
    catch (error) {
        console.log("Users data is not found");
        return;
    }
});
const blockUblockUser = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blockUblockUser = yield adminRepository_1.default.blockUblockUser(email, isBlocked);
        console.log(blockUblockUser, "blockUblockUser");
        if (blockUblockUser)
            return { message: true };
        else
            return { message: null };
    }
    catch (error) {
        console.log("Error in block n unblock", error);
        return { message: null };
    }
});
const getHiringManagers = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const HRCount = yield adminRepository_1.default.HRCount();
        console.log(HRCount, "jobCount1");
        const getHiringManagers = yield adminRepository_1.default.getHiringManagers(pageNumber, HRsPerPage);
        if (getHiringManagers !== undefined) {
            if (getHiringManagers.length)
                return {
                    message: "success",
                    data: getHiringManagers,
                    totalPages: HRCount,
                };
        }
        else {
            return { message: "failed", data: null, totalPages: null };
        }
    }
    catch (error) {
        console.log("error happened in fetching hiring managers data in adminService");
    }
});
const getHiringManagersApproved = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const HRCount = yield adminRepository_1.default.HRCountApproved();
        console.log(HRCount, "jobCount2");
        const getHiringManagers = yield adminRepository_1.default.getHiringManagersApproved(pageNumber, HRsPerPage);
        if (getHiringManagers !== undefined) {
            if (getHiringManagers.length)
                return {
                    message: "success",
                    data: getHiringManagers,
                    totalPages: HRCount,
                };
        }
        else {
            return { message: "failed", data: null, totalPages: null };
        }
    }
    catch (error) {
        console.log("error happened in fetching hiring managers data in adminService");
    }
});
const blockUnblockHR = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blockUblockHR = yield adminRepository_1.default.blockUblockHR(email, isBlocked);
        console.log(blockUblockHR, "blockUblockUser");
        if (blockUblockHR)
            return { message: true };
        else
            return { message: null };
    }
    catch (error) {
        console.log("Error in block n unblock", error);
        return { message: null };
    }
});
const hrApprove = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hrApprove = yield adminRepository_1.default.hrApprove(email);
        console.log(hrApprove, "hrApprove");
        if (hrApprove)
            return { message: true };
        else
            return { message: null };
    }
    catch (error) {
        console.log("Error in hrApprove", error);
        return { message: null };
    }
});
const getAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield adminRepository_1.default.findAdmin(id);
        if (adminData && (adminData === null || adminData === void 0 ? void 0 : adminData.password) !== undefined) {
            adminData.password = "";
            return {
                data: adminData,
                message: "success",
            };
        }
        else
            return {
                data: null,
                message: "Not found",
            };
    }
    catch (error) {
        return {
            data: null,
            message: "error",
        };
    }
});
const saveNewPlan = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPlan = new plan_1.default(body);
        yield newPlan.save();
        if (newPlan)
            return { message: 'success' };
        else
            return { message: 'failed' };
    }
    catch (error) {
        console.log("Error in save new plan at adminservice", error);
        return { message: 'failed' };
    }
});
const getPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanDatas = yield adminRepository_1.default.getPlans();
        console.log(getPlanDatas, 'data-- plan');
        if (getPlanDatas && getPlanDatas.length) {
            return {
                message: 'success',
                data: getPlanDatas
            };
        }
        else {
            return {
                message: 'failed',
                data: null
            };
        }
    }
    catch (error) {
        console.log("Error in get new plan at adminservice", error);
        return {
            message: 'failed',
            data: null
        };
    }
});
const getPlanData = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanData = yield adminRepository_1.default.getPlanData(planId);
        console.log(getPlanData, 'plandata---');
        if (getPlanData && Object.keys(getPlanData).length) {
            return {
                message: 'success',
                data: getPlanData
            };
        }
        else
            return {
                message: 'failed',
                data: null
            };
    }
    catch (error) {
        console.log("Error in get  plan at adminservice", error);
        return {
            message: 'failed',
            data: null
        };
    }
});
const updatePlan = (planId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUpdatedData = yield adminRepository_1.default.updatePlan(planId, body);
        console.log(getUpdatedData, 'getupdated data----');
        console.log(getUpdatedData, 'plandata---');
        if (getUpdatedData) {
            return {
                message: 'success',
            };
        }
        else
            return {
                message: 'failed',
            };
    }
    catch (error) {
        console.log("Error in update  plan at adminservice", error);
        return {
            message: 'failed',
        };
    }
});
const deletePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getDeletedData = yield adminRepository_1.default.deletePlan(id);
        console.log(getDeletedData, 'getupdated data----');
        console.log(getDeletedData, 'plandata---');
        if (getDeletedData) {
            return {
                message: 'success',
            };
        }
        else
            return {
                message: 'failed',
            };
    }
    catch (error) {
        console.log("Error in delete  plan at adminservice", error);
        return {
            message: 'failed',
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
    deletePlan
};
