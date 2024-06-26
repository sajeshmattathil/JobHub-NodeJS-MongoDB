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
const followers_1 = __importDefault(require("../Model/followers"));
const transactions_1 = __importDefault(require("../Model/transactions"));
try {
}
catch (error) { }
const createNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 5);
        user.password = hashedPassword;
        const checkExistingUsers = yield userRepository_1.default.findUser(user.email);
        if (checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified)
            return { status: 409 };
        if ((checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified) === false)
            return { status: 201 };
        const newUser = new user_1.default(user);
        yield newUser.save();
        return { status: 201 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const saveOtp = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkUserExists = yield userRepository_1.default.getOtp(data.userId);
        if (checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.userId) {
            const updateOTP = yield userRepository_1.default.findAndUpdateOtp(data);
            if (updateOTP)
                return { status: 201 };
        }
        else {
            const saveOtp = yield otp_1.default.create(data);
            return { status: 201 };
        }
        return { status: 406 };
    }
    catch (error) {
        console.log(error, "error saving otp");
        return { status: 500 };
    }
});
const getSavedOtp = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getOtp = yield userRepository_1.default.getOtp(userID);
        if (getOtp)
            return getOtp;
        else
            return null;
    }
    catch (error) {
        return null;
        console.log("Otp not found");
    }
});
const verifyLoginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield userRepository_1.default.findUser(user.email);
        if (userDetails !== undefined && userDetails !== null) {
            const comparePsw = yield bcrypt_1.default.compare(user.password, userDetails.password);
            if (userDetails && comparePsw && !userDetails.isBlocked) {
                return {
                    userData: userDetails.email,
                    status: 201,
                    ObjectId: userDetails._id,
                };
            }
            else
                return { userData: null, status: 400, message: "Password is incorrect" };
        }
        else {
            return { userData: null, status: 500, message: "No user is found in this email" };
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
        return { status: 200 };
    }
    catch (error) {
        console.log(error, "error in set verified true at user service");
        return { status: 500 };
    }
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userRepository_1.default.findUser(id);
        if (getUser)
            return {
                data: getUser,
                status: 200
            };
        else
            return {
                data: null,
                status: 400,
            };
    }
    catch (error) {
        return {
            data: null,
            status: 500,
        };
    }
});
const updateUser = (data, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateUser = yield userRepository_1.default.updateUser(data, userEmail);
        if (updateUser === null || updateUser === void 0 ? void 0 : updateUser.message)
            return { status: 201 };
        else
            return { status: 400 };
    }
    catch (error) {
        return { status: 400 };
    }
});
const getJobs = (pageNumber, jobsPerPage, body, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let getUser;
        if (userEmail.trim())
            getUser = yield userRepository_1.default.findUser(userEmail);
        const jobCount = yield userRepository_1.default.jobCount(body, (getUser === null || getUser === void 0 ? void 0 : getUser.skills) ? getUser.skills : []);
        const getJobs = yield userRepository_1.default.getJobs(pageNumber, jobsPerPage, body, (getUser === null || getUser === void 0 ? void 0 : getUser.skills) ? getUser.skills : []);
        if (getJobs !== undefined) {
            if (getJobs.length)
                return { data: getJobs, totalPages: jobCount, status: 201 };
            else
                return { data: null, status: 400 };
        }
        else
            return { data: null, totalPages: null, status: 500 };
    }
    catch (error) {
        return { data: null, totalPages: null, status: 500 };
    }
});
const checkUserExists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield userRepository_1.default.findUser(userId);
        if (findUser !== undefined) {
            if (findUser !== null) {
                if (findUser.email) {
                    return { status: 200 };
                }
                else {
                    return { status: 404 };
                }
            }
        }
        return { status: 404 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const resetPassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 15);
        body.password = hashedPassword;
        const resetPassword = yield userRepository_1.default.resetPassword(body);
        return { status: 201 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const getJobData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userRepository_1.default.getJobData(id);
        if (data && data.length) {
            return { status: 201, data: data };
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
const saveAppliedJob = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newJob = new appliedJobs_1.default(body);
        newJob.save();
        yield userRepository_1.default.addUserEmailInJobPost(body.userEmail, body.jobId);
        return { status: 201, appliedJob: newJob };
    }
    catch (error) {
        console.log(error, "error happened in saving applied jobs at service");
        return { status: 500, appliedJob: null };
    }
});
const followAndUnfollow = (hrID, value, userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (value == "follow+") {
            const newFollower = new followers_1.default({ hrID, userID });
            newFollower.save();
        }
        else {
            yield userRepository_1.default.UnfollowHR(hrID, userID);
        }
        return { status: 200 };
    }
    catch (error) {
        console.log(error, "error in follow and unfollow hr at service");
        return { status: 500 };
    }
});
const getPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlanDatas = yield userRepository_1.default.getPlans();
        if (getPlanDatas && getPlanDatas.length) {
            return {
                status: 201,
                data: getPlanDatas,
            };
        }
        else {
            return {
                status: 400,
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
const savePayment = (body, id, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userRepository_1.default.addUserToPlan(body.planId, userEmail);
        const updatePayment = yield userRepository_1.default.savePayment(body, id);
        body.time = body.startedAt;
        const newTransaction = new transactions_1.default(body);
        newTransaction.save();
        if (updatePayment && updatePayment.modifiedCount !== 0 && (newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction._id))
            return { status: 200 };
        else
            return { status: 400 };
    }
    catch (error) {
        return { status: 500 };
    }
});
const getPrevChatUsers = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield userRepository_1.default.getPrevChatUsers(userEmail);
        const lastChat = yield userRepository_1.default.getLastMsg(usersData, userEmail);
        let result = [];
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
            return { status: 201, data: result };
        else
            return { status: 404, data: null };
    }
    catch (error) {
        return { status: 500, data: null };
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
    getPrevChatUsers,
};
