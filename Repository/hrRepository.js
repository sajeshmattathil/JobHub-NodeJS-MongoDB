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
const hr_1 = __importDefault(require("../Model/hr"));
const hr_2 = __importDefault(require("../Model/hr"));
const job_1 = __importDefault(require("../Model/job"));
const otp_1 = __importDefault(require("../Model/otp"));
const appliedJobs_1 = __importDefault(require("../Model/appliedJobs"));
const findHr = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_2.default.findOne({ email: email });
    }
    catch (error) {
        return null;
    }
});
const findHrById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_2.default.findOne({ _id: id });
    }
    catch (error) {
        return null;
    }
});
const getOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield otp_1.default.findOne({ userId: userId });
    }
    catch (error) {
        console.log("Otp not found in database", error);
    }
});
const findAndUpdateOtp = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield otp_1.default.updateOne({ userId: data.userId }, {
            $set: {
                createdAt: data.createdAt,
                otp: data.otp,
                userId: data.userId,
            },
        });
    }
    catch (error) {
        console.log("Error in updating otp ");
        return;
    }
});
const setVerifiedTrue = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hr_1.default.updateOne({ email: userId }, { $set: { isVerified: true } });
    }
    catch (error) {
        console.log(error, "error happened in setting true for user account in repo");
        return;
    }
});
const getJobsData = (id, pageNumber, jobsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(pageNumber, jobsPerPage, "repo ");
        return yield job_1.default.find({ hrObjectId: id, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(jobsPerPage * (pageNumber - 1))
            .limit(jobsPerPage);
    }
    catch (error) { }
});
const jobCount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield job_1.default.countDocuments({ hrObjectId: id });
    }
    catch (error) {
        console.error("error happened in fetching job count in userrepo");
    }
});
const updateProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield hr_1.default.updateOne({ email: data.email }, {
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
        console.log("error in update user in db", error);
        return { message: "failed" };
    }
});
const findSelectedJobData = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(jobId, "id");
        return yield appliedJobs_1.default.aggregate([
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
        console.log(error, "error happened in fetching job data at repo");
        return;
    }
});
const deleteJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appliedJobUpdate = yield appliedJobs_1.default.updateOne({ jobId: jobId }, { $set: { isDeleted: true } });
        const jobUpdate = yield job_1.default.updateOne({ _id: jobId }, { $set: { isDeleted: true } });
        return { appliedJobUpdate, jobUpdate };
    }
    catch (error) {
        console.log(error, "error happened in deleting job at repo");
    }
});
const updateJob = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateJob = yield job_1.default.updateOne({ _id: body.jobId }, {
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
        console.log(error, "error happened in updating job at repo");
        return { message: "failed" };
    }
});
const updateJobpostHRViewed = (jobId, HRId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(jobId, HRId, "job id---->");
        return yield appliedJobs_1.default.updateOne({ jobId: jobId, hrId: HRId }, { $set: { isHRViewed: true } });
    }
    catch (error) {
        console.log(error, "error happened in updating job hr viewed at repo");
    }
});
const updateIsShortListed = (jobId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(userId, 'id ---->>>>>>>>>>');
        return yield job_1.default.updateOne({ _id: jobId, "appliedUsers.email": userId }, {
            $set: { "appliedUsers.$.isShortListed": true },
        });
    }
    catch (error) {
        console.log(error, "error happened in shortlisting user at repo");
    }
});
const getShortListedUsers = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield job_1.default.aggregate([
            {
                $match: { _id: new mongodb_1.ObjectId(jobId), "appliedUsers.isShortListed": true },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: 'email',
                    localField: "appliedUsers.email",
                    as: 'shortListedUsers'
                }
            },
            {
                $unwind: '$shortListedUsers'
            }
        ]);
    }
    catch (error) {
        console.log(error, "error happened in getting shortlisted user at repo");
    }
});
exports.default = {
    findHr,
    findHrById,
    getOtp,
    findAndUpdateOtp,
    setVerifiedTrue,
    jobCount,
    getJobsData,
    updateProfile,
    findSelectedJobData,
    deleteJob,
    updateJob,
    updateJobpostHRViewed,
    updateIsShortListed,
    getShortListedUsers,
};
