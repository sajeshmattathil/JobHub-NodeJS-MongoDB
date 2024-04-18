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
const mongodb_1 = require("mongodb");
const admin_1 = __importDefault(require("../Model/admin"));
const hr_1 = __importDefault(require("../Model/hr"));
const plan_1 = __importDefault(require("../Model/plan"));
const user_1 = __importDefault(require("../Model/user"));
const transactions_1 = __importDefault(require("../Model/transactions"));
const findAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield admin_1.default.findOne({ email: email });
        console.log(adminData, "ddddd");
        return adminData;
    }
    catch (error) {
        console.log(error);
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_1.default.find({ isVerified: true });
    }
    catch (error) {
        console.log("Data of all users not found");
        return;
    }
});
const blockUblockUser = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_1.default.updateOne({ email: email }, { $set: { isBlocked: !isBlocked } });
    }
    catch (error) {
        console.log("Error in blocking user", error);
    }
});
const getHiringManagers = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.find({ isApproved: false })
            .skip(HRsPerPage * (pageNumber - 1))
            .limit(HRsPerPage);
    }
    catch (error) {
        console.log("error happend in fetching hiringmanagers data in repo ");
    }
});
const HRCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.countDocuments({ isApproved: false });
    }
    catch (error) {
        console.error("error happened in fetching job count in userrepo");
    }
});
const getHiringManagersApproved = (pageNumber, HRsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.find({ isApproved: true })
            .skip(HRsPerPage * (pageNumber - 1))
            .limit(HRsPerPage);
    }
    catch (error) {
        console.log("error happend in fetching hiringmanagers data in repo ");
    }
});
const HRCountApproved = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.countDocuments({ isApproved: true });
    }
    catch (error) {
        console.error("error happened in fetching job count in userrepo");
    }
});
const blockUblockHR = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.updateOne({ email: email }, { $set: { isBlocked: !isBlocked } });
    }
    catch (error) {
        console.log("Error in blocking hr", error);
    }
});
const hrApprove = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.updateOne({ email: email }, { $set: { isApproved: true } });
    }
    catch (error) {
        console.log("Error in approve hr", error);
    }
});
const getPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield plan_1.default.find({ isActive: true });
    }
    catch (error) {
        console.log("Error in getting plans at repo", error);
    }
});
const getPlanData = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield plan_1.default.findOne({ _id: new mongodb_1.ObjectId(planId) });
    }
    catch (error) {
        console.log("Error in getting plan at repo", error);
    }
});
const updatePlan = (planId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield plan_1.default.updateOne({ _id: planId }, {
            $set: {
                amount: body.amount,
                planName: body.planName,
                duration: body.duration,
            },
        });
    }
    catch (error) {
        console.log("Error in updating plan at repo", error);
    }
});
const deletePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield plan_1.default.updateOne({ _id: id }, {
            $set: {
                isActive: false,
            },
        });
    }
    catch (error) {
        console.log("Error in deleting plan at repo", error);
    }
});
const findUsersTotal = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_1.default.countDocuments({ isBlocked: false });
    }
    catch (error) {
        return null;
    }
});
const findHRTotal = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.countDocuments({ isApproved: true });
    }
    catch (error) {
        return null;
    }
});
const findTotalActiveSubcribers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_1.default.countDocuments({ "subscription.isSubscribed": true });
    }
    catch (error) {
        return null;
    }
});
const findTotalRevenueGenerated = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield transactions_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
    }
    catch (error) {
        return null;
    }
});
exports.default = {
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
    findUsersTotal,
    findHRTotal,
    findTotalActiveSubcribers,
    findTotalRevenueGenerated
};
