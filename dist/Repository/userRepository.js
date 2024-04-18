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
const job_1 = __importDefault(require("../Model/job"));
const otp_1 = __importDefault(require("../Model/otp"));
const user_1 = __importDefault(require("../Model/user"));
const plan_1 = __importDefault(require("../Model/plan"));
const chat_1 = __importDefault(require("../Model/chat"));
const followers_1 = __importDefault(require("../Model/followers"));
try {
}
catch (error) { }
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, "user find repo");
    try {
        return yield user_1.default.findOne({ email: email });
    }
    catch (error) {
        console.log(error);
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
        return yield user_1.default.updateOne({ email: userId }, { $set: { isVerified: true } });
    }
    catch (error) { }
});
const updateUser = (data, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data, "newUserData----");
        yield user_1.default.updateOne({ email: userEmail }, {
            $set: {
                fname: data.fname,
                lname: data.lname,
                resume: data.resume,
                experience: data.experience,
                skills: data.skills,
                educationalQualification: data.educationalQualification,
                workExperience: data.workExperience,
            },
        });
        return { message: "success" };
    }
    catch (error) {
        console.log("error in update user in db", error);
    }
});
const getJobs = (pageNumber, jobsPerPage, body, skills) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            isDeleted: false,
            "salaryPackage.max": {
                $lte: body.salaryPackage ? body.salaryPackage : 10,
            },
        };
        if (Object.keys(body).length) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    {
                        locations: { $in: [new RegExp(body.value, "i")] },
                    },
                    {
                        qualification: { $in: [new RegExp(body.value, "i")] },
                    },
                    {
                        jobType: { $regex: `${body.value}`, $options: "i" },
                    },
                    {
                        jobRole: { $regex: `${body.value}`, $options: "i" },
                    },
                ] });
        }
        else if (Object.keys(body).length) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    { locations: { $in: [new RegExp(body.value, "i")] } },
                    { qualification: { $in: [new RegExp(body.value, "i")] } },
                    { jobType: { $regex: `${body.value}`, $options: "i" } },
                    { jobRole: { $regex: `${body.value}`, $options: "i" } },
                ] });
        }
        else if (skills.length) {
            query = Object.assign(Object.assign({}, query), { qualification: { $in: skills } });
        }
        let sortQuery = { createdAt: -1 };
        if (body.sort === "relevance") {
            sortQuery = { createdAt: 1 };
        }
        if (body.industry.length) {
            let orCondition = body.industry.map((item) => {
                return { isDeleted: false, industry: item.industry };
            });
            query = { $or: orCondition };
        }
        console.log(query, "query");
        const jobs = yield job_1.default.find(query)
            .sort(sortQuery)
            .skip(jobsPerPage * (pageNumber - 1))
            .limit(jobsPerPage);
        if (body.sort === "old")
            return jobs.reverse();
        return jobs;
    }
    catch (error) {
        console.error("error in fetching jobs from db for user", error);
        return [];
    }
});
const jobCount = (body, skills) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query;
        if (body.value.trim()) {
            query = {
                $or: [
                    {
                        isDeleted: false,
                        "salaryPackage.max": { $lte: body.salaryPackage },
                        locations: { $in: [new RegExp(body.value, "i")] },
                    },
                    {
                        isDeleted: false,
                        "salaryPackage.max": { $lte: body.salaryPackage },
                        qualification: { $in: [new RegExp(body.value, "i")] },
                    },
                    {
                        isDeleted: false,
                        "salaryPackage.max": { $lte: body.salaryPackage },
                        jobType: { $regex: `${body.value}`, $options: "i" },
                    },
                    {
                        isDeleted: false,
                        "salaryPackage.max": { $lte: body.salaryPackage },
                        jobRole: { $regex: `${body.value}`, $options: "i" },
                    },
                ],
            };
        }
        else if (!Object.keys(body).length && skills.length) {
            query = { isDeleted: false, qualification: { $in: [...skills] } };
        }
        else {
            query = { isDeleted: false };
        }
        if (body.industry.length) {
            let orCondition = body.industry.map((item) => {
                return { isDeleted: false, industry: item.industry };
            });
            query = { $or: orCondition };
        }
        return yield job_1.default.countDocuments(query);
    }
    catch (error) {
        console.error("error happened in fetching job count in userrepo");
    }
});
const resetPassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_1.default.updateOne({ email: body.email }, {
            $set: {
                password: body.password,
            },
        });
    }
    catch (error) {
        console.log("error in resetPassword at repo");
    }
});
const getJobData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield job_1.default.aggregate([
            { $match: { _id: new mongodb_1.ObjectId(id) } },
            {
                $lookup: {
                    from: "hrs",
                    localField: "hrObjectId",
                    foreignField: "_id",
                    as: "jobData",
                },
            },
            {
                $lookup: {
                    from: "appliedjobs",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "appliedData",
                },
            },
        ]);
    }
    catch (error) {
        console.log(error, "error in fetching job data at repo");
    }
});
const addUserEmailInJobPost = (userEmail, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(userEmail, jobId);
        const newAppliedUser = {
            email: userEmail,
            isShortListed: false,
        };
        return yield job_1.default.updateOne({ _id: jobId }, { $push: { appliedUsers: newAppliedUser } });
    }
    catch (error) {
        console.log(error, "error in updating user email in job post at repo");
        return;
    }
});
const UnfollowHR = (hrID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield followers_1.default.deleteOne({ hrID: hrID, userID: userID });
    }
    catch (error) {
        console.log(error, "error in follow and unfollow hr at repo");
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
const savePayment = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        body.startedAt = body.subscribedAt;
        const currentDate = body.subscribedAt;
        const date = new Date(currentDate);
        body.expireAt = date.setDate(date.getDate() + body.duration * 30);
        return yield user_1.default.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                "subscription.isSubscribed": true,
                "subscription.plan": body.planName,
                "subscription.paymentId": body.razorpayId,
                "subscription.amount": body.amount,
                "subscription.startedAt": body.startedAt,
                "subscription.expireAt": body.expireAt,
            },
        });
    }
    catch (error) {
        console.log("Error in save payment at repo");
    }
});
const addUserToPlan = (planId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(planId, userEmail, ">>>>>");
        return yield plan_1.default.updateOne({ _id: planId }, { $push: { users: userEmail } });
    }
    catch (error) {
        console.log("Error in save add user to plan at repo");
    }
});
const getPrevChatUsers = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield chat_1.default.distinct("recipient1", { recipient2: userEmail });
    }
    catch (error) {
        console.log(error, "error happende in getting prev chat users in repo");
    }
});
const getLastMsg = (usersData, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(usersData, userEmail, "repoooo");
        if (usersData === null || usersData === void 0 ? void 0 : usersData.length)
            return yield chat_1.default
                .find({ recipient2: userEmail, recipient1: { $in: usersData } })
                .sort({ time: -1 });
        return;
    }
    catch (error) {
        console.log(error, "error happend in getting last msg hrs in repo");
    }
});
exports.default = {
    findUser,
    getOtp,
    findAndUpdateOtp,
    setVerifiedTrue,
    updateUser,
    getJobs,
    jobCount,
    resetPassword,
    getJobData,
    addUserEmailInJobPost,
    UnfollowHR,
    getPlans,
    savePayment,
    addUserToPlan,
    getPrevChatUsers,
    getLastMsg,
};
