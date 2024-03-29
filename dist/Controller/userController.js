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
const userService_1 = __importDefault(require("../Service/userService"));
const mailer_1 = __importDefault(require("../Utils/mailer"));
const jwtUser_1 = __importDefault(require("../Middleware/JWT/jwtUser"));
const https_1 = __importDefault(require("https"));
const razorpay_1 = __importDefault(require("razorpay"));
const signupSubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const newUser = yield userService_1.default.createNewUser(req.body);
        console.log(newUser, "$$$$");
        if ((newUser === null || newUser === void 0 ? void 0 : newUser.message) == "User created" ||
            (newUser === null || newUser === void 0 ? void 0 : newUser.message) == "user data exists ,not verified") {
            res
                .status(201)
                .json({ status: 201, message: "User created successfully" });
            (0, mailer_1.default)(req.body.email, req.body.otp);
            const saveOtp = yield userService_1.default.saveOtp({
                userId: req.body.email,
                otp: req.body.otp,
                createdAt: req.body.createdAt,
            });
        }
        else if ((newUser === null || newUser === void 0 ? void 0 : newUser.message) == "exists") {
            res
                .status(409)
                .json({ status: 409, message: "User with this email already exists" });
        }
        else
            res
                .status(400)
                .json({ status: 400, message: "Something went wrong ,try again" });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "hello");
        const getSavedOtp = yield userService_1.default.getSavedOtp(req.body.userId);
        console.log(getSavedOtp, "666754646");
        if (getSavedOtp) {
            const expiryTime = new Date(getSavedOtp.createdAt);
            expiryTime.setMinutes(expiryTime.getMinutes() + 10);
            const currentTime = Date.now();
            console.log(req.body.otp, getSavedOtp.otp, "two otps");
            if (req.body.otp === getSavedOtp.otp &&
                currentTime < expiryTime.getTime()) {
                if (!req.body.purpose) {
                    yield userService_1.default.setVerifiedTrue(req.body.userId);
                }
                res.status(201).json({ status: 201, message: "otp verified" });
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
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, mailer_1.default)(req.body.userId, req.body.otp);
        const saveOtp = yield userService_1.default.saveOtp(req.body);
        if ((saveOtp === null || saveOtp === void 0 ? void 0 : saveOtp.message) === "success")
            res.status(200).json({ status: 200 });
        res.status(400).json({ status: 400 });
    }
    catch (error) { }
});
const loginSubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const verifyUser = yield userService_1.default.verifyLoginUser(req.body);
        console.log(verifyUser.userData, "verify user");
        if (verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.userData) {
            const token = jwtUser_1.default.generateToken(verifyUser.userData, verifyUser.ObjectId);
            res.status(201).json({
                status: 201,
                message: "User verification successful",
                userData: verifyUser.userData,
                token: token,
            });
        }
        else {
            res.status(400).json({
                status: 400,
                message: "User login failed. Invalid credentials.",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userEmail;
        const response = yield userService_1.default.getUser(id);
        if ((response === null || response === void 0 ? void 0 : response.message) === "success")
            res.status(201).json({ status: 201, user: response === null || response === void 0 ? void 0 : response.data });
        if ((response === null || response === void 0 ? void 0 : response.message) === "error")
            res.status(500).json({ status: 500, user: null });
        if ((response === null || response === void 0 ? void 0 : response.message) === "Not found")
            res.status(400).json({ status: 400, user: null });
    }
    catch (error) {
        console.log("Something went wrong", error);
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "req.body update");
        const userEmail = req.userEmail;
        const updateUser = yield userService_1.default.updateUser(req.body, userEmail);
        if ((updateUser === null || updateUser === void 0 ? void 0 : updateUser.message) === "success")
            res.status(201).json({ status: 201 });
        else
            res.status(400).json({ status: 400 });
    }
    catch (error) {
        console.log(error, "erro in updating user data at controller");
    }
});
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageNumber = req.query.page;
        const jobsPerPage = req.query.jobsPerPage;
        console.log(req.body, "req body");
        const getJobs = yield userService_1.default.getJobs(Number(pageNumber), Number(jobsPerPage), req.body);
        if ((getJobs === null || getJobs === void 0 ? void 0 : getJobs.message) === "success")
            res.status(201).json({
                jobData: getJobs.data,
                totalJobs: getJobs.totalPages,
                status: 201,
            });
        if ((getJobs === null || getJobs === void 0 ? void 0 : getJobs.message) === "failed")
            res.status(400).json({ jobData: null, totalJobs: null, status: 400 });
        else
            res.status(204).json({ jobData: null, totalJobs: null, status: 204 });
    }
    catch (error) {
        console.log("error happened in usercontroller for fetching jobs ");
    }
});
const saveForgotOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkUserExists = yield userService_1.default.checkUserExists(req.body.userId);
        console.log(checkUserExists, "checkUserExists");
        if ((checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.message) == "user exists") {
            (0, mailer_1.default)(req.body.userId, req.body.otp);
            yield userService_1.default.saveOtp(req.body);
            res.status(201).json({ status: 201 });
        }
        else if ((checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.message) == "user not found") {
            console.log(66144987817);
            res.status(404).json({ status: 404 });
        }
        else
            res.status(400).json({ status: 400 });
    }
    catch (error) {
        res.status(500).json({ status: 500 });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService_1.default.resetPassword(req.body);
        console.log(response, "resetpassword response");
        if (response.message === "success")
            res.status(201).json({ status: 201 });
        else
            res.status(404).json({ status: 404 });
    }
    catch (error) {
        console.log("error in resetPassword at controller");
        res.status(500).json({ status: 500 });
    }
});
const getJobData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield userService_1.default.getJobData(id);
        if (response && response.message === "success")
            res.json({ jobDataFetched: response.data, status: 201 });
        else
            res.json({ jobDataFetched: null, status: 404 });
    }
    catch (error) {
        console.log(error, "error in fetching jobdata at controller");
        res.json({ jobDataFetched: null, status: 500 });
    }
});
const saveAppliedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.userId;
        const userEmail = req.userEmail;
        const updatedBody = Object.assign(Object.assign({}, req.body), { userId: _id, userEmail: userEmail });
        const response = yield userService_1.default.saveAppliedJob(updatedBody);
        if (response.message === "success")
            res.json({ status: 201, appliedJob: response.appliedJob });
        else
            res.json({ status: 400 });
    }
    catch (error) {
        console.log(error, "error in saving applied job at controller");
        res.json({ status: 500 });
    }
});
const followAndUnfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "value");
        const userEmail = req.userEmail;
        const response = yield userService_1.default.followAndUnfollow(req.body.HRId, req.body.value, userEmail);
        console.log(response, "res---follow unfollow");
        if (response.message == "success")
            res.status(200);
        else
            res.status(400);
    }
    catch (error) {
        console.log(error, "error in follow and unfollow hr at controller");
        res.status(500);
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
const getPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService_1.default.getPlans();
        console.log(response, "response---getplans");
        if ((response.message = "success"))
            res.json({ status: 201, planDatas: response.data });
        else
            res.json({ status: 400, planDatas: null });
    }
    catch (error) {
        console.log("error happened in get all plan data in admincontroller");
        res.json({ status: 500, planDatas: null });
    }
});
const savePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.userId;
        const userEmail = req.userEmail;
        const response = yield userService_1.default.savePayment(req.body, _id, userEmail);
        if (response)
            res.status(200).send("Payment saved successfully");
        else
            res.status(400).send("Bad Request");
    }
    catch (error) {
        console.log("error happened in save payment in admincontroller");
        res.status(500).send("Something Went wrong,try again");
        ;
    }
});
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const options = {
            amount,
            currency: "INR",
            receipt: "order_rcptid_11",
            payment_capture: 1,
        };
        const order = yield razorpay.orders.create(options);
        res.json({ order });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create order" });
        console.error("Error:", error);
    }
});
exports.default = {
    signupSubmit,
    verifyOtp,
    resendOTP,
    loginSubmit,
    getUser,
    updateUser,
    getJobs,
    saveForgotOtp,
    resetPassword,
    getJobData,
    saveAppliedJob,
    followAndUnfollow,
    downloadFileFromChat,
    getPlans,
    savePayment,
    createOrder
};
