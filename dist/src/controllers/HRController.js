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
exports.HRController = void 0;
const https_1 = __importDefault(require("https"));
const jwtHR_1 = __importDefault(require("../../Middleware/JWT/jwtHR"));
const mailer_1 = __importDefault(require("../../Utils/mailer"));
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
let HRController = class HRController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    hrSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveHrData = yield this.interactor.saveHrData(req.body);
                if ((saveHrData === null || saveHrData === void 0 ? void 0 : saveHrData.status) === 201) {
                    res.status(201).json({ status: 201 });
                    (0, mailer_1.default)(req.body.email, req.body.otp);
                    const saveOtp = yield this.interactor.saveOtp({
                        userId: req.body.email,
                        otp: req.body.otp,
                        createdAt: req.body.createdAt,
                    });
                }
                if ((saveHrData === null || saveHrData === void 0 ? void 0 : saveHrData.status) === 200)
                    res.status(409).json({ message: "HR already exists" });
            }
            catch (error) {
                res.status(400).json({ status: 400 });
            }
        });
    }
    verifyOtp(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getSavedOtp = yield this.interactor.getSavedOtp(req.body.userId);
                if (getSavedOtp !== undefined &&
                    getSavedOtp.status === 200 &&
                    ((_a = getSavedOtp === null || getSavedOtp === void 0 ? void 0 : getSavedOtp.data) === null || _a === void 0 ? void 0 : _a.createdAt) !== undefined) {
                    const expiryTime = new Date((_b = getSavedOtp === null || getSavedOtp === void 0 ? void 0 : getSavedOtp.data) === null || _b === void 0 ? void 0 : _b.createdAt);
                    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
                    const currentTime = Date.now();
                    if (req.body.otp === ((_c = getSavedOtp === null || getSavedOtp === void 0 ? void 0 : getSavedOtp.data) === null || _c === void 0 ? void 0 : _c.otp) &&
                        currentTime < expiryTime.getTime()) {
                        const setVerifiedTrue = yield this.interactor.setVerifiedTrue(req.body.userId);
                        if (setVerifiedTrue && setVerifiedTrue.status === 200)
                            res.status(201).json({ status: 201, message: "Hr verified" });
                    }
                    else {
                        res
                            .status(401)
                            .json({ status: 401, message: "OTP verification failed " });
                    }
                }
                else {
                    res.status(404).json({ status: 404, message: "OTP expired" });
                }
            }
            catch (error) {
                console.error("Error verifying OTP:", error);
                res.status(500).json({ status: 500, message: "Internal server error" });
            }
        });
    }
    hrLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.verifyHrData(req.body);
                if (response.data && (response === null || response === void 0 ? void 0 : response.message) === "verified") {
                    const token = jwtHR_1.default.generateToken(req.body.email, response.data._id);
                    res.status(201).json({ status: 201, token: token });
                }
                if ((response === null || response === void 0 ? void 0 : response.message) === "declained")
                    res.status(401).json({ status: 401 });
                if ((response === null || response === void 0 ? void 0 : response.message) == "no user found")
                    res.status(400).json({ status: 400 });
                if ((response === null || response === void 0 ? void 0 : response.message) === "")
                    res.status(500).json({ status: 500 });
            }
            catch (error) {
                console.log("login failed ");
            }
        });
    }
    createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "bodyyy ---- create job");
                const response = yield this.interactor.saveJob(req.body);
                console.log(response, "res----createjob");
                if (response.message === "success")
                    res.status(201).json({ status: 201, message: "success" });
                if (response.message === "failed")
                    res
                        .status(400)
                        .json({ status: 400, message: "Creating new Job failed" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: 500, message: "Something Went Wrong,try again" });
            }
        });
    }
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(11111);
                const hrEmail = req.params.id;
                console.log(hrEmail, "email");
                const pageNumber = req.query.page;
                const jobsPerPage = req.query.jobsPerPage;
                console.log(pageNumber, jobsPerPage, "----queries");
                const response = yield this.interactor.getJobsData(hrEmail, Number(pageNumber), Number(jobsPerPage));
                // console.log(response,'resoponsejobs');
                if ((response === null || response === void 0 ? void 0 : response.message) === "")
                    res.status(201).json({
                        status: 201,
                        jobs: response === null || response === void 0 ? void 0 : response.data,
                        totalPages: response === null || response === void 0 ? void 0 : response.totalPages,
                    });
                if ((response === null || response === void 0 ? void 0 : response.message) === "No jobs found")
                    res.status(400).json({ status: 400, jobs: "", totalPages: null });
                if ((response === null || response === void 0 ? void 0 : response.message) === "error")
                    res.status(500).json({ status: 500, jobs: "", totalPages: null });
            }
            catch (error) {
                console.log(error, "error happended in fetching jobs");
            }
        });
    }
    getHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.HRId;
                console.log(id, "hr === id");
                const response = yield this.interactor.getHR(id);
                if ((response === null || response === void 0 ? void 0 : response.message) === "success") {
                    res.status(201).json({ status: 201, HR: response === null || response === void 0 ? void 0 : response.data });
                }
                if ((response === null || response === void 0 ? void 0 : response.message) === "error")
                    res.status(500).json({ status: 500, HR: null });
                if ((response === null || response === void 0 ? void 0 : response.message) === "Not found")
                    res.status(400).json({ status: 400, HR: null });
            }
            catch (error) {
                console.log("Something went wrong", error);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.interactor.updateProfile(req.body);
                if ((response === null || response === void 0 ? void 0 : response.message) === "success")
                    res.status(201).json({ status: 201 });
                else
                    res.status(400).json({ status: 400 });
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    getJobDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const response = yield this.interactor.getJobDetails(jobId);
                if (response.message == "success")
                    res.json({ status: 201, jobData: response === null || response === void 0 ? void 0 : response.data });
                else
                    res.json({ status: 400, jobData: null });
            }
            catch (error) {
                console.log(error, "error happened in fetching job details at hr controller");
                res.json({ status: 500, jobData: null });
            }
        });
    }
    deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const response = yield this.interactor.deleteJob(jobId);
                console.log(response, "response=== delete");
                if (response.message === "success")
                    res.status(201).json({ status: 201 });
                else
                    res.status(400);
            }
            catch (error) {
                console.log(error, "error happened in deleting job at hr controller");
                res.status(500);
            }
        });
    }
    updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.updateJob(req.body);
                if (response && response.message === "success")
                    res.json({ status: 201 });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                console.log(error, "error happened in updating job at hr controller");
                res.json({ status: 500 });
            }
        });
    }
    updateJobpostHRViewed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const HRId = req._id;
                console.log(HRId, "id---->");
                const response = yield this.interactor.updateJobpostHRViewed(jobId, HRId);
                console.log(response, "res---hr viewed");
            }
            catch (error) {
                console.log(error, "error happened in updating job hr viewed at hr controller");
            }
        });
    }
    downloadFileFromChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "body---->>>>");
                const { url: pdfHttpLink, fileName } = req.body;
                https_1.default
                    .get(pdfHttpLink, (pdfResponse) => {
                    console.log(fileName, "filename");
                    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                    res.setHeader("Content-Type", "application/pdf");
                    pdfResponse.pipe(res);
                })
                    .on("error", (err) => {
                    console.error("Error downloading PDF:", err);
                    res.status(500).send("Error downloading PDF");
                });
            }
            catch (error) {
                console.log(error, "error happened in download file at hr controller");
                res.status(500).send("Internal Server Error");
            }
        });
    }
    shortListUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "body----shortlist");
                const response = yield this.interactor.shortListUser(req.body.jobId, req.body.userId);
                console.log(response, "res----shortlist");
                if (response.message === "success")
                    res.json({ status: 200 });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                console.log(error, "error happened in short list user at hr controller");
                res.json({ status: 500 });
            }
        });
    }
    getShortListedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.jobId;
                console.log(jobId, "jobiddd");
                const response = yield this.interactor.getShortListedUsers(jobId);
                if (response.message === "success")
                    res.json({ status: 200, usersData: response.data });
                else
                    res.json({ status: 400, usersData: null });
            }
            catch (error) {
                console.log(error, "error happened in  getting short list  at hr controller");
                res.json({ status: 500, usersData: null });
            }
        });
    }
    removeFromShortListed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "body---remove");
                const response = yield this.interactor.removeFromShortListed(req.body);
                console.log(response, "ressss");
                if (response)
                    res.status(200).send("Succefully removed from short listed");
                else
                    res.status(400).send("Bad request");
            }
            catch (error) {
                console.log(error, "error happened in  getting short list  at hr controller");
                res.status(500).send("Interna server error");
            }
        });
    }
    getPrevChatUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const HREmail = req.HRId;
                const response = yield this.interactor.getPrevChatUsers(HREmail);
                console.log(response, "res");
                if (response.success === true)
                    res.status(201).json({ chatData: response.data });
                else
                    res.status(404).json({ chatData: null });
            }
            catch (error) {
                res.status(500).json({ chatData: null });
            }
        });
    }
    getFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const HRId = req._id;
                console.log(HRId, "id>>>>>");
                const getAllFollowers = yield this.interactor.getFollowersData(HRId);
                console.log(getAllFollowers, "res");
                if (getAllFollowers.status === 201)
                    res.status(201).json({ followersData: getAllFollowers.data });
                else
                    res.status(406).json({ message: "No user found" });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
};
exports.HRController = HRController;
exports.HRController = HRController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Utils_1.INTERFACE_TYPE.HRInteractor))
], HRController);
