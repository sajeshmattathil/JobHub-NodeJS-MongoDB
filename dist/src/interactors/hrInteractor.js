"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.HRInteractor = void 0;
const hr_1 = __importDefault(require("../../Model/hr"));
const job_1 = __importDefault(require("../../Model/job"));
const otp_1 = __importDefault(require("../../Model/otp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
let HRInteractor = class HRInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    saveHrData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(data.password, 5);
                data.password = hashedPassword;
                const checkExistingHr = yield this.repository.findHr(data.email);
                if (checkExistingHr)
                    return { status: 200, message: "exists" };
                const hrData = new hr_1.default(data);
                yield hrData.save();
                return { status: 201 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    saveOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUserExists = yield this.repository.getOtp(data.userId);
                if (checkUserExists) {
                    yield this.repository.findAndUpdateOtp(data);
                }
                else {
                    yield otp_1.default.create(data);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getSavedOtp(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getOtp = yield this.repository.getOtp(userID);
                if (getOtp)
                    return { status: 200, data: getOtp };
            }
            catch (error) {
                console.log("Otp not found");
                return;
            }
        });
    }
    setVerifiedTrue(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.setVerifiedTrue(userId);
                return { status: 200 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    verifyHrData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyHrData = yield this.repository.findHr(data.email);
                if (verifyHrData) {
                    const decryptedPassword = yield bcrypt_1.default.compare(data.password, verifyHrData.password);
                    if (decryptedPassword)
                        return { message: "verified", data: verifyHrData };
                    else
                        return { message: "declined", data: null };
                }
                else
                    return { message: "no user found", data: null };
            }
            catch (error) {
                return { message: "", data: null };
            }
        });
    }
    saveJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hrObjectId = yield this.repository.findHr(data.createdBy);
                if (hrObjectId)
                    data.hrObjectId = hrObjectId._id;
                data.salaryPackage = {
                    min: Number(data.salaryScale[0] + data.salaryScale[1]) * 100000,
                    max: Number(data.salaryScale[3] + data.salaryScale[4]) * 100000,
                };
                const job = new job_1.default(data);
                yield job.save();
                return { message: "success" };
            }
            catch (error) {
                console.error(error);
                return { message: "failed" };
            }
        });
    }
    getJobsData(hrEmail, pageNumber, jobsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hrData = yield this.repository.findHr(hrEmail);
                if (hrData !== null && Object.keys(hrData).length) {
                    const getJobsData = yield this.repository.getJobsData(hrData._id, pageNumber, jobsPerPage);
                    const jobCount = yield this.repository.jobCount(hrData._id);
                    if (getJobsData !== undefined && getJobsData) {
                        if (getJobsData.length)
                            return { data: getJobsData, totalPages: jobCount, message: "" };
                        else
                            return { data: null, totalPages: null, message: "No jobs found" };
                    }
                }
                return { data: null, totalPages: null, message: "No jobs found" };
            }
            catch (error) {
                return { data: [], totalPages: null, message: "error" };
            }
        });
    }
    getHR(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getHR = yield this.repository.findHr(id);
                if (getHR && getHR.password !== undefined) {
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
    }
    updateProfile(HRData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield this.repository.updateProfile(HRData);
                if (updateUser === null || updateUser === void 0 ? void 0 : updateUser.message)
                    return { message: "success" };
                else
                    return { message: "failed" };
            }
            catch (error) {
                console.log("error in updating profile at userservice");
                return { message: "failed" };
            }
        });
    }
    getJobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.repository.findSelectedJobData(jobId);
                if (getData && getData.length)
                    return { message: "success", data: getData };
                else
                    return { message: "failed", data: null };
            }
            catch (error) {
                console.log(error, "error happened in fetching job data at hr service");
                return { message: "failed", data: null };
            }
        });
    }
    deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteJobData = yield this.repository.deleteJob(jobId);
                console.log(deleteJobData, "deletjondata----");
                return { message: "success" };
            }
            catch (error) {
                console.log(error, "error happened in deleting job in hr service");
                return { message: "failed" };
            }
        });
    }
    updateJob(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedResult = yield this.repository.updateJob(body);
                console.log(updatedResult, "result-----");
                if (updatedResult.message == "success")
                    return { message: "success" };
                else
                    return { message: "failed" };
            }
            catch (error) {
                console.log(error, "error happened in updating job in hr service");
                return { message: "failed" };
            }
        });
    }
    updateJobpostHRViewed(jobId, HRId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateHRViewed = yield this.repository.updateJobpostHRViewed(jobId, HRId);
                console.log(updateHRViewed, "updtate job service");
                return { message: "success" };
            }
            catch (error) {
                console.log(error, "error happened in updating job hr viewed in hr service");
                return { message: "failed" };
            }
        });
    }
    shortListUser(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateShortListedTrue = yield this.repository.updateIsShortListed(jobId, userId);
                console.log(updateShortListedTrue, "updateShortListedTrue");
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
    }
    getShortListedUsers(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shortListedData = yield this.repository.getShortListedUsers(jobId);
                console.log(shortListedData, "shortListedData");
                if (shortListedData && shortListedData.length)
                    return { message: "success", data: shortListedData };
                else
                    return { message: "failed", data: null };
            }
            catch (error) {
                console.log(error, "error happened in gettind shortlist user in hr service");
                return { message: "failed", data: null };
            }
        });
    }
    removeFromShortListed(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removedData = yield this.repository.removeFromShortListed(body.email, body.jobId);
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
    }
    getPrevChatUsers(HREmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield this.repository.getPrevChatUsers(HREmail);
                console.log(usersData, "users docs");
                const lastChat = yield this.repository.getLastMsg(usersData, HREmail);
                let result = [];
                if (usersData && lastChat) {
                    for (let user of usersData) {
                        let time = Date.now();
                        for (let chat of lastChat) {
                            if (chat.recipient2 === user) {
                                result.push({ text: chat.text, name: chat.recipient2 });
                                break;
                            }
                        }
                    }
                }
                if (usersData && usersData.length && result)
                    return { success: true, data: result };
                else
                    return { success: false, data: null };
            }
            catch (error) {
                return { success: false, data: null };
            }
        });
    }
    getFollowersData(HRId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getFollowersData = yield this.repository.getFollowersData(HRId);
                if (getFollowersData && getFollowersData.length)
                    return { status: 201, data: getFollowersData };
                else
                    return { status: 400, message: "No data found" };
            }
            catch (error) {
                return { status: 500, message: "Internal server error" };
            }
        });
    }
};
exports.HRInteractor = HRInteractor;
exports.HRInteractor = HRInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Utils_1.INTERFACE_TYPE.HRRepository))
], HRInteractor);
