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
const user_1 = __importDefault(require("../Model/user"));
const userRepository_1 = __importDefault(require("../Repository/userRepository"));
const otp_1 = __importDefault(require("../Model/otp"));
const appliedJobs_1 = __importDefault(require("../Model/appliedJobs"));
try {
}
catch (error) { }
const createNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 5);
        user.password = hashedPassword;
        const checkExistingUsers = yield userRepository_1.default.findUser(user.email);
        console.log(checkExistingUsers, "exists or not");
        if (checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified)
            return { message: "exists" };
        if ((checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified) === false)
            return { message: "user data exists ,not verified" };
        // await User.create(user);
        const newUser = new user_1.default(user);
        console.log("user data saved");
        yield newUser.save();
        return { message: "User created" };
    }
    catch (error) {
        return { message: "User not created" };
    }
});
const saveOtp = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data, "saveOtp");
        const checkUserExists = yield userRepository_1.default.getOtp(data.userId);
        console.log(checkUserExists, "checkUserExists");
        if (checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.userId) {
            const updateOTP = yield userRepository_1.default.findAndUpdateOtp(data);
            if (updateOTP)
                return { message: "success" };
        }
        else {
            const saveOtp = yield otp_1.default.create(data);
            console.log(saveOtp, ">>>>");
            return { message: "success" };
        }
        return { message: "failed" };
    }
    catch (error) {
        console.log(error, "error saving otp");
    }
});
const getSavedOtp = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getOtp = yield userRepository_1.default.getOtp(userID);
        if (getOtp)
            return getOtp;
        else
            return;
    }
    catch (error) {
        console.log("Otp not found");
    }
});
const verifyLoginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield userRepository_1.default.findUser(user.email);
        console.log(userDetails, "user find");
        if (userDetails !== undefined && userDetails !== null) {
            const comparePsw = yield bcrypt_1.default.compare(user.password, userDetails.password);
            if (userDetails && comparePsw && !userDetails.isBlocked) {
                return {
                    userData: userDetails.email,
                    message: "user verified",
                    ObjectId: userDetails._id,
                };
            }
            else
                return { userData: null, message: "Password is incorrect" };
        }
        else {
            return { userData: null, message: "No user is found in this email" };
        }
    }
    catch (error) {
        console.log(error);
        return { userData: null, message: "Something went wrong " };
    }
});
const setVerifiedTrue = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setVerifiedTrue = yield userRepository_1.default.setVerifiedTrue(userId);
    }
    catch (error) {
        console.log(error, "error in set verified true at user service");
    }
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userRepository_1.default.findUser(id);
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
    }
    catch (error) {
        return {
            data: null,
            message: "error",
        };
    }
});
const updateUser = (data, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateUser = yield userRepository_1.default.updateUser(data, userEmail);
        console.log(updateUser, "updated ---result");
        if (updateUser === null || updateUser === void 0 ? void 0 : updateUser.message)
            return { message: "success" };
        else
            return { message: "failed" };
    }
    catch (error) {
        console.log("error in updating profile at userservice");
    }
});
const getJobs = (pageNumber, jobsPerPage, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCount = yield userRepository_1.default.jobCount(body);
        console.log(jobCount, "jobCount");
        const getJobs = yield userRepository_1.default.getJobs(pageNumber, jobsPerPage, body);
        if (getJobs !== undefined) {
            if (getJobs.length)
                return { data: getJobs, totalPages: jobCount, message: "success" };
            else
                return { data: null, message: "no data" };
        }
        else
            return { data: null, totalPages: null, message: "failed" };
    }
    catch (error) {
        console.log("error in fetching jobs by user");
    }
});
const checkUserExists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield userRepository_1.default.findUser(userId);
        if (findUser !== undefined) {
            if (findUser !== null) {
                if (findUser.email) {
                    return { message: "user exists" };
                }
                else {
                    return { message: "user not found" };
                }
            }
        }
        return { message: "user not found" };
    }
    catch (error) {
        console.log("error happened in verifyin userId is existing or not for forgot password in Controller");
    }
});
const resetPassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 15);
        body.password = hashedPassword;
        const resetPassword = yield userRepository_1.default.resetPassword(body);
        return { message: "success" };
    }
    catch (error) {
        console.log("error in resetPassword at userService");
        return { message: "failed" };
    }
});
const getJobData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userRepository_1.default.getJobData(id);
        console.log(data, "data---job");
        if (data && data.length) {
            return { message: "success", data: data };
        }
        else {
            return {
                message: "failed ",
                data: null,
            };
        }
    }
    catch (error) {
        console.log(error, "error in fetching job data at user service");
    }
});
const saveAppliedJob = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(body, "bodyyyyy");
        const newJob = new appliedJobs_1.default(body);
        newJob.save();
        const x = yield userRepository_1.default.addUserEmailInJobPost(body.userEmail, body.jobId);
        console.log(x, "xxx");
        return { message: "success", appliedJob: newJob };
    }
    catch (error) {
        console.log(error, "error happened in saving applied jobs at service");
        return { message: "failed", appliedJob: null };
    }
});
const followAndUnfollow = (HRId, value, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (value == "follow+") {
            yield userRepository_1.default.followHR(HRId, userEmail);
        }
        else {
            yield userRepository_1.default.UnfollowHR(HRId, userEmail);
        }
        return { message: "success" };
    }
    catch (error) {
        console.log(error, "error in follow and unfollow hr at service");
        return { message: "failed" };
    }
});
const getPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanDatas = yield userRepository_1.default.getPlans();
        console.log(getPlanDatas, "data-- plan");
        if (getPlanDatas && getPlanDatas.length) {
            return {
                message: "success",
                data: getPlanDatas,
            };
        }
        else {
            return {
                message: "failed",
                data: null,
            };
        }
    }
    catch (error) {
        console.log("Error in get new plan at adminservice", error);
        return {
            message: "failed",
            data: null,
        };
    }
});
const savePayment = (body, id, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userRepository_1.default.addUserToPlan(body.planId, userEmail);
        const updatePayment = yield userRepository_1.default.savePayment(body, id);
        if (updatePayment && updatePayment.modifiedCount !== 0)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log("Error in save payment adminservice", error);
    }
});
exports.default = {
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
};
