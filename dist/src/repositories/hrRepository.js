"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.HRRepository = void 0;
const mongodb_1 = require("mongodb");
const hr_1 = __importDefault(require("../../Model/hr"));
const job_1 = __importDefault(require("../../Model/job"));
const otp_1 = __importDefault(require("../../Model/otp"));
const appliedJobs_1 = __importDefault(require("../../Model/appliedJobs"));
const chat_1 = __importDefault(require("../../Model/chat"));
const followers_1 = __importDefault(require("../../Model/followers"));
const inversify_1 = require("inversify");
let HRRepository = class HRRepository {
    constructor() {
        this.HRModel = hr_1.default;
        this.jobModel = job_1.default;
        this.otpModel = otp_1.default;
        this.appliedJobsModel = appliedJobs_1.default;
        this.followersModel = followers_1.default;
        this.chatModel = chat_1.default;
    }
    findHr(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.HRModel.findOne({ email: email });
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findHrById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.HRModel.findOne({ _id: id });
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getOtp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpModel.findOne({ userId: userId });
            }
            catch (error) {
                console.error("Otp not found in database", error);
                return null;
            }
        });
    }
    findAndUpdateOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpModel.updateOne({ userId: data.userId }, {
                    $set: {
                        createdAt: data.createdAt,
                        otp: data.otp,
                        userId: data.userId,
                    },
                });
            }
            catch (error) {
                console.error("Error in updating otp ", error);
                return null;
            }
        });
    }
    setVerifiedTrue(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.HRModel.updateOne({ email: userId }, { $set: { isVerified: true } });
            }
            catch (error) {
                console.error("Error happened in setting true for user account in repo", error);
                return null;
            }
        });
    }
    getJobsData(id, pageNumber, jobsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobModel.find({ hrObjectId: id, isDeleted: false })
                    .sort({ createdAt: -1 })
                    .skip(jobsPerPage * (pageNumber - 1))
                    .limit(jobsPerPage);
            }
            catch (error) {
                console.error("Error happened in fetching job data in user repo", error);
                return [];
            }
        });
    }
    jobCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobModel.countDocuments({ hrObjectId: id });
            }
            catch (error) {
                console.error("Error happened in fetching job count in user repo", error);
                return 0;
            }
        });
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.HRModel.updateOne({ email: data.email }, {
                    $set: {
                        name: data.name,
                        company: data.company,
                        resume: data.resume,
                        experience: data.experience,
                        website: data.website,
                        employeesNumber: data.employeesNumber,
                    },
                });
                return { message: "success" };
            }
            catch (error) {
                console.error("error in update user in db", error);
                return { message: "failed" };
            }
        });
    }
    findSelectedJobData(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.appliedJobsModel.aggregate([
                    { $match: { jobId: new mongodb_1.ObjectId(jobId), isDeleted: false } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "jobId",
                            foreignField: "_id",
                            as: "jobPostData",
                        },
                    },
                ]);
            }
            catch (error) {
                console.error(error, "error happened in fetching job data at repo");
                return null;
            }
        });
    }
    deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedJobUpdate = yield this.appliedJobsModel.updateOne({ jobId: jobId }, { $set: { isDeleted: true } });
                const jobUpdate = yield job_1.default.updateOne({ _id: jobId }, { $set: { isDeleted: true } });
                return { appliedJobUpdate, jobUpdate };
            }
            catch (error) {
                console.error(error, "error happened in deleting job at repo");
            }
        });
    }
    updateJob(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateJob = yield this.jobModel.updateOne({ _id: body.jobId }, {
                    $set: {
                        description: body.description,
                        qualification: body.qualification,
                        company: body.company,
                        experience: body.experience,
                        salaryScale: body.salaryScale,
                        educationalQualification: body.educationalQualification,
                        industry: body.industry,
                        locations: body.locations,
                    },
                });
                if (updateJob)
                    return { message: "success" };
                else
                    return { message: "failed" };
            }
            catch (error) {
                console.error(error, "error happened in updating job at repo");
                return { message: "failed" };
            }
        });
    }
    updateJobpostHRViewed(jobId, HRId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.appliedJobsModel.updateOne({ jobId: jobId, hrId: HRId }, { $set: { isHRViewed: true } });
            }
            catch (error) {
                console.error(error, "error happened in updating job hr viewed at repo");
            }
        });
    }
    updateIsShortListed(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobModel.updateOne({ _id: jobId, "appliedUsers.email": userId }, {
                    $set: { "appliedUsers.$.isShortListed": true },
                });
            }
            catch (error) {
                console.error(error, "error happened in shortlisting");
            }
        });
    }
    getShortListedUsers(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobModel.aggregate([
                    {
                        $match: {
                            _id: new mongodb_1.ObjectId(jobId),
                            "appliedUsers.isShortListed": true,
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "email",
                            localField: "appliedUsers.email",
                            as: "shortListedUsers",
                        },
                    },
                    {
                        $unwind: "$shortListedUsers",
                    },
                ]);
            }
            catch (error) {
                console.error(error, "error happened in getting shortlisted user at repo");
            }
        });
    }
    removeFromShortListed(email, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobModel.updateOne({ _id: jobId, "appliedUsers.email": email }, {
                    $set: { "appliedUsers.$.isShortListed": false },
                });
            }
            catch (error) {
                console.error(error, "error happened in getting remove from shortlisted user at repo");
            }
        });
    }
    getPrevChatUsers(HREmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatModel.distinct("recipient2", { recipient1: HREmail });
            }
            catch (error) {
                console.error(error, "error happende in getting prev chat users in repo");
            }
        });
    }
    getLastMsg(usersData, HREmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (usersData)
                    return yield this.chatModel
                        .find({ recipient1: HREmail, recipient2: { $in: [...usersData] } })
                        .sort({ time: -1 });
            }
            catch (error) {
                console.error(error, "error happend in getting last msg users in repo");
            }
        });
    }
    getFollowersData(HRId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.followersModel.aggregate([
                    {
                        $match: { hrID: new mongodb_1.ObjectId(HRId), isBlocked: false },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userID",
                            foreignField: "_id",
                            as: "users",
                        },
                    },
                    {
                        $unwind: "$users",
                    },
                    {
                        $project: {
                            _id: 0,
                            'users._id': 1,
                            'users.fname': 1,
                            'users.lname': 1,
                            'users.resume': 1
                        },
                    },
                ]);
            }
            catch (error) {
                console.error(error, "error happened in fetching followers data in repo");
                return null;
            }
        });
    }
};
exports.HRRepository = HRRepository;
exports.HRRepository = HRRepository = __decorate([
    (0, inversify_1.injectable)()
], HRRepository);
