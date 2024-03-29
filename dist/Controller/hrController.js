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
const hrService_1 = __importDefault(require("../Service/hrService"));
const mailer_1 = __importDefault(require("../Utils/mailer"));
const hrRepository_1 = __importDefault(require("../Repository/hrRepository"));
const jwtHR_1 = __importDefault(require("../Middleware/JWT/jwtHR"));
const https_1 = __importDefault(require("https"));
const hrSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "hrsignup");
        const saveHrData = yield hrService_1.default.saveHrData(req.body);
        if ((saveHrData === null || saveHrData === void 0 ? void 0 : saveHrData.message) === "saved") {
            res.status(201).json({ status: 201 });
            (0, mailer_1.default)(req.body.email, req.body.otp);
            const saveOtp = yield hrService_1.default.saveOtp({
                userId: req.body.email,
                otp: req.body.otp,
                createdAt: req.body.createdAt,
            });
        }
        if ((saveHrData === null || saveHrData === void 0 ? void 0 : saveHrData.message) === "exists")
            res.status(409).json({ message: "HR already exists" });
    }
    catch (error) {
        res.status(400).json({ status: 400 });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "hello");
        const getSavedOtp = yield hrService_1.default.getSavedOtp(req.body.userId);
        console.log(getSavedOtp, "666754646");
        if (getSavedOtp) {
            const expiryTime = new Date(getSavedOtp.createdAt);
            expiryTime.setMinutes(expiryTime.getMinutes() + 10);
            const currentTime = Date.now();
            if (req.body.otp === getSavedOtp.otp &&
                currentTime < expiryTime.getTime()) {
                console.log(1111);
                const setVerifiedTrue = yield hrRepository_1.default.setVerifiedTrue(req.body.userId);
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
const hrLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield hrService_1.default.verifyHrData(req.body);
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
const createJOb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "bodyyy ---- create job");
        const response = yield hrService_1.default.saveJob(req.body);
        console.log(response, "res----createjob");
        if (response.message === "success")
            res.status(201).json({ status: 201, message: "success" });
        if (response.message === "failed")
            res.status(400).json({ status: 400, message: "Creating new Job failed" });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: 500, message: "Something Went Wrong,try again" });
    }
});
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(11111);
        const hrEmail = req.params.id;
        console.log(hrEmail, "email");
        const pageNumber = req.query.page;
        const jobsPerPage = req.query.jobsPerPage;
        console.log(pageNumber, jobsPerPage, "----queries");
        const response = yield hrService_1.default.getJobsData(hrEmail, Number(pageNumber), Number(jobsPerPage));
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
const getHR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.HRId;
        console.log(id, 'hr === id');
        const response = yield hrService_1.default.getHR(id);
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
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield hrService_1.default.updateProfile(req.body);
        if ((response === null || response === void 0 ? void 0 : response.message) === "success")
            res.status(201).json({ status: 201 });
        else
            res.status(400).json({ status: 400 });
    }
    catch (error) {
        res.status(500).json({ status: 500 });
    }
});
const getJobDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const response = yield hrService_1.default.getJobDetails(jobId);
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
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const response = yield hrService_1.default.deleteJob(jobId);
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
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield hrService_1.default.updateJob(req.body);
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
const updateJobpostHRViewed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const HRId = req._id;
        console.log(HRId, "id---->");
        const response = yield hrService_1.default.updateJobpostHRViewed(jobId, HRId);
        console.log(response, "res---hr viewed");
    }
    catch (error) {
        console.log(error, "error happened in updating job hr viewed at hr controller");
    }
});
const downloadFileFromChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
const shortListUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "body----shortlist");
        const response = yield hrService_1.default.shortListUser(req.body.jobId, req.body.userId);
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
const getShortListedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.jobId;
        console.log(jobId, "jobiddd");
        const response = yield hrService_1.default.getShortListedUsers(jobId);
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
const removeFromShortListed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "body---remove");
        const response = yield hrService_1.default.removeFromShortListed(req.body);
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
exports.default = {
    hrSignup,
    verifyOtp,
    hrLogin,
    createJOb,
    getJobs,
    getHR,
    updateProfile,
    getJobDetails,
    deleteJob,
    updateJob,
    updateJobpostHRViewed,
    downloadFileFromChat,
    shortListUser,
    getShortListedUsers,
    removeFromShortListed,
};
