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
exports.UserInteractor = void 0;
const user_1 = __importDefault(require("../../Model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_1 = __importDefault(require("../../Model/otp"));
const appliedJobs_1 = __importDefault(require("../../Model/appliedJobs"));
const transactions_1 = __importDefault(require("../../Model/transactions"));
const followers_1 = __importDefault(require("../../Model/followers"));
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
let UserInteractor = class UserInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(user.password, 5);
                user.password = hashedPassword;
                const checkExistingUsers = yield this.repository.findUser(user.email);
                if (checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified)
                    return { status: 409 };
                if ((checkExistingUsers === null || checkExistingUsers === void 0 ? void 0 : checkExistingUsers.isVerified) === false)
                    return { status: 201 };
                const newUser = new user_1.default(user);
                yield newUser.save();
                return { status: 201 };
            }
            catch (error) {
                console.error(error);
                return { status: 500 };
            }
        });
    }
    saveOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUserExists = yield this.repository.getOtp(data.userId);
                if (checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.userId) {
                    const updateOTP = yield this.repository.findAndUpdateOtp(data);
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
                console.error(error, "error saving otp");
                return { status: 500 };
            }
        });
    }
    getSavedOtp(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getOtp = yield this.repository.getOtp(userID);
                if (getOtp)
                    return getOtp;
                else
                    return null;
            }
            catch (error) {
                console.error("Otp not found");
                return null;
            }
        });
    }
    verifyLoginUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield this.repository.findUser(user.email);
                if (userDetails !== undefined && userDetails !== null) {
                    const comparePsw = yield bcrypt_1.default.compare(user.password, userDetails.password);
                    if (userDetails && comparePsw && !userDetails.isBlocked) {
                        return {
                            userData: userDetails.email,
                            status: 201,
                            ObjectId: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id,
                        };
                    }
                    else
                        return {
                            userData: null,
                            status: 400,
                            message: "Password is incorrect",
                        };
                }
                else {
                    return {
                        userData: null,
                        status: 500,
                        message: "No user is found in this email",
                    };
                }
            }
            catch (error) {
                console.error(error);
                return { userData: null, message: "Something went wrong " };
            }
        });
    }
    setVerifiedTrue(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setVerifiedTrue = yield this.repository.setVerifiedTrue(userId);
                return { status: 200 };
            }
            catch (error) {
                console.error(error, "error in set verified true at user service");
                return { status: 500 };
            }
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield this.repository.findUser(id);
                if (getUser)
                    return {
                        data: getUser,
                        status: 200,
                    };
                else
                    return {
                        data: null,
                        status: 400,
                    };
            }
            catch (error) {
                console.error(error);
                return {
                    data: null,
                    status: 500,
                };
            }
        });
    }
    updateUser(data, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield this.repository.updateUser(data, userEmail);
                if (updateUser === null || updateUser === void 0 ? void 0 : updateUser.message)
                    return { status: 201 };
                else
                    return { status: 400 };
            }
            catch (error) {
                console.error(error);
                return { status: 400 };
            }
        });
    }
    getJobs(pageNumber, jobsPerPage, body, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let getUser;
                if (userEmail.trim())
                    getUser = yield this.repository.findUser(userEmail);
                const jobCount = yield this.repository.jobCount(body, (getUser === null || getUser === void 0 ? void 0 : getUser.skills) ? getUser.skills : []);
                const getJobs = yield this.repository.getJobs(pageNumber, jobsPerPage, body, (getUser === null || getUser === void 0 ? void 0 : getUser.skills) ? getUser.skills : []);
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
                console.error(error);
                return { data: null, totalPages: null, status: 500 };
            }
        });
    }
    checkUserExists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.repository.findUser(userId);
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
                console.error(error);
                return { status: 500 };
            }
        });
    }
    resetPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(body.password, 15);
                body.password = hashedPassword;
                const resetPassword = yield this.repository.resetPassword(body);
                return { status: 201 };
            }
            catch (error) {
                console.error(error);
                return { status: 500 };
            }
        });
    }
    getJobData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.repository.getJobData(id);
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
                console.error(error);
                return {
                    status: 500,
                    data: null,
                };
            }
        });
    }
    saveAppliedJob(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.userEmail !== undefined && body.jobId !== undefined) {
                    const newJob = new appliedJobs_1.default(body);
                    newJob.save();
                    yield this.repository.addUserEmailInJobPost(body.userEmail, body.jobId);
                    // if (newJob) return { status: 201, data: newJob };
                    if (newJob)
                        return { status: 201 };
                }
                return { status: 401 };
            }
            catch (error) {
                console.error(error, "error happened in saving applied jobs at service");
                return { status: 500, appliedJob: null };
            }
        });
    }
    followAndUnfollow(hrID, value, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (value == "follow+") {
                    const newFollower = new followers_1.default({ hrID, userID });
                    newFollower.save();
                }
                else {
                    yield this.repository.UnfollowHR(hrID, userID);
                }
                return { status: 200 };
            }
            catch (error) {
                console.error(error, "error in follow and unfollow hr at service");
                return { status: 500 };
            }
        });
    }
    getPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getPlanDatas = yield this.repository.getPlans();
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
                console.error(error);
                return {
                    status: 500,
                    data: null,
                };
            }
        });
    }
    savePayment(body, id, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.addUserToPlan(body.planId, userEmail);
                const updatePayment = yield this.repository.savePayment(body, id);
                body.time = body.startedAt;
                const newTransaction = new transactions_1.default(body);
                newTransaction.save();
                if (updatePayment &&
                    updatePayment.modifiedCount !== 0 &&
                    (newTransaction === null || newTransaction === void 0 ? void 0 : newTransaction._id))
                    return { status: 200 };
                else
                    return { status: 400 };
            }
            catch (error) {
                console.error(error);
                return { status: 500 };
            }
        });
    }
    getPrevChatUsers(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield this.repository.getPrevChatUsers(userEmail);
                const lastChat = yield this.repository.getLastMsg(usersData, userEmail);
                let result = [];
                if (usersData && lastChat) {
                    for (let user of usersData) {
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
                console.error(error);
                return { status: 500, data: null };
            }
        });
    }
};
exports.UserInteractor = UserInteractor;
exports.UserInteractor = UserInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Utils_1.INTERFACE_TYPE.UserRepository))
], UserInteractor);
