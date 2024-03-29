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
const hr_1 = __importDefault(require("../Model/hr"));
const job_1 = __importDefault(require("../Model/job"));
const otp_1 = __importDefault(require("../Model/otp"));
const hrRepository_1 = __importDefault(require("../Repository/hrRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saveHrData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    bcrypt_1.default;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(data.password, 5);
        data.password = hashedPassword;
        const checkExistingHr = yield hrRepository_1.default.findHr(data.email);
        if (checkExistingHr)
            return { message: "exists" };
        const hrData = new hr_1.default(data);
        yield hrData.save();
        return { message: "saved" };
    }
    catch (error) {
        console.log(error, "");
    }
});
const saveOtp = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data, "saveOtp");
        const checkUserExists = yield hrRepository_1.default.getOtp(data.userId);
        console.log(checkUserExists, "checkUserExists");
        if (checkUserExists) {
            yield hrRepository_1.default.findAndUpdateOtp(data);
        }
        else {
            const saveOtp = yield otp_1.default.create(data);
            console.log(saveOtp, ">>>>");
        }
        return;
    }
    catch (error) { }
});
const getSavedOtp = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getOtp = yield hrRepository_1.default.getOtp(userID);
        if (getOtp)
            return getOtp;
        else
            return;
    }
    catch (error) {
        console.log("Otp not found");
    }
});
const setVerifiedTrue = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setVerifiedTrue = yield hrRepository_1.default.setVerifiedTrue(userId);
    }
    catch (error) { }
});
const verifyHrData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyHrData = yield hrRepository_1.default.findHr(data.email);
        if (verifyHrData) {
            const decryptedPassword = yield bcrypt_1.default.compare(data.password, verifyHrData.password);
            if (decryptedPassword)
                return { message: "verified", data: verifyHrData };
            else
                return { message: "declained", data: null };
        }
        else
            return { message: "no user found", data: null };
    }
    catch (error) {
        return { message: "", data: null };
    }
});
const saveJob = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hrObjectId = yield hrRepository_1.default.findHr(data.createdBy);
        if (hrObjectId)
            data.hrObjectId = hrObjectId === null || hrObjectId === void 0 ? void 0 : hrObjectId._id;
        console.log(hrObjectId, "obid");
        const job = new job_1.default(data);
        yield job.save();
        return { message: "success" };
    }
    catch (error) {
        console.log(error, "error--createjob");
        return { message: "failed" };
    }
});
const getJobsData = (hrEmail, pageNumber, jobsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hrData = yield hrRepository_1.default.findHr(hrEmail);
        if (hrData !== null && Object.keys(hrData).length) {
            const getJobsData = yield hrRepository_1.default.getJobsData(hrData._id, pageNumber, jobsPerPage);
            const jobCount = yield hrRepository_1.default.jobCount(hrData._id);
            // console.log(getJobsData,jobCount,'service---');
            if (getJobsData != undefined) {
                if (getJobsData.length)
                    return { data: getJobsData, totalPages: jobCount, message: "" };
                else
                    return { data: null, totalPages: null, message: "No jobs found" };
            }
        }
    }
    catch (error) {
        return { data: null, message: "error" };
    }
});
const getHR = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getHR = yield hrRepository_1.default.findHr(id);
        if (getHR && (getHR === null || getHR === void 0 ? void 0 : getHR.password) !== undefined) {
            getHR.password = "";
            return {
                data: getHR,
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
const updateProfile = (HRData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateUser = yield hrRepository_1.default.updateProfile(HRData);
        if (updateUser === null || updateUser === void 0 ? void 0 : updateUser.message)
            return { message: "success" };
        else
            return { message: "failed" };
    }
    catch (error) {
        console.log("error in updating profile at userservice");
    }
});
const getJobDetails = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getData = yield hrRepository_1.default.findSelectedJobData(jobId);
        if (getData && getData.length)
            return { message: "success", data: getData };
        else
            return { messag: "failed", data: null };
    }
    catch (error) {
        console.log(error, "error happened in fetching job data at hr service");
        return { message: "failed", data: null };
    }
});
const deleteJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteJobData = yield hrRepository_1.default.deleteJob(jobId);
        console.log(deleteJobData, "deletjondata----");
        return { message: "success" };
    }
    catch (error) {
        console.log(error, "error happened in deleting job in hr service");
        return { message: "failed" };
    }
});
const updateJob = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedResult = yield hrRepository_1.default.updateJob(body);
        console.log(updatedResult, "result-----");
        if (updatedResult.message == "success")
            return { message: "success" };
        else
            return { message: "failed" };
    }
    catch (error) {
        console.log(error, "error happened in updating job in hr service");
    }
});
const updateJobpostHRViewed = (jobId, HRId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateHRViewed = yield hrRepository_1.default.updateJobpostHRViewed(jobId, HRId);
        console.log(updateHRViewed, "updtate job service");
        return { message: "success" };
    }
    catch (error) {
        console.log(error, "error happened in updating job hr viewed in hr service");
        return { message: "failed" };
    }
});
const shortListUser = (jobId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateShortListedTrue = yield hrRepository_1.default.updateIsShortListed(jobId, userId);
        console.log(updateShortListedTrue, 'updateShortListedTrue');
        if (updateShortListedTrue)
            return { message: "success" };
        else
            return { message: "failed" };
    }
    catch (error) {
        console.log(error, "error happened in shortlist user in hr service");
        return { message: "failed" };
    }
});
const getShortListedUsers = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortListedData = yield hrRepository_1.default.getShortListedUsers(jobId);
        console.log(shortListedData, 'shortListedData');
        if (shortListedData && shortListedData.length)
            return { message: 'success', data: shortListedData };
        else
            return { message: 'failed', data: null };
    }
    catch (error) {
        console.log(error, "error happened in gettind shortlist user in hr service");
        return { message: 'failed', data: null };
    }
});
const removeFromShortListed = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removedData = yield hrRepository_1.default.removeFromShortListed(body);
        if ((removedData === null || removedData === void 0 ? void 0 : removedData.modifiedCount) && (removedData === null || removedData === void 0 ? void 0 : removedData.modifiedCount) > 0)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log(error, "error happened in gettind shortlist user in hr service");
        return false;
    }
});
exports.default = {
    saveHrData,
    saveOtp,
    getSavedOtp,
    setVerifiedTrue,
    verifyHrData,
    saveJob,
    getJobsData,
    getHR,
    updateProfile,
    getJobDetails,
    deleteJob,
    updateJob,
    updateJobpostHRViewed,
    shortListUser,
    getShortListedUsers,
    removeFromShortListed
};
