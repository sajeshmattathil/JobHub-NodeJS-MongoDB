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
exports.UserController = void 0;
const mailer_1 = __importDefault(require("../../Utils/mailer"));
const razorpay_1 = __importDefault(require("razorpay"));
const https_1 = __importDefault(require("https"));
const jwtUser_1 = __importDefault(require("../../Middleware/JWT/jwtUser"));
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
let UserController = class UserController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    signupSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body, "bodyyyy");
            try {
                const newUser = yield this.interactor.createNewUser(req.body);
                console.log(newUser, "newUser");
                if ((newUser === null || newUser === void 0 ? void 0 : newUser.status) == 201) {
                    res
                        .status(201)
                        .json({ status: 201, message: "User created successfully" });
                    yield (0, mailer_1.default)(req.body.email, req.body.otp);
                    const saveOtp = yield this.interactor.saveOtp({
                        userId: req.body.email,
                        otp: req.body.otp,
                        createdAt: req.body.createdAt,
                    });
                }
                else if ((newUser === null || newUser === void 0 ? void 0 : newUser.status) == 409) {
                    res.status(409).json({
                        status: 409,
                        message: "User with this email already exists",
                    });
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
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getSavedOtp = yield this.interactor.getSavedOtp(req.body.userId);
                if (getSavedOtp && getSavedOtp.createdAt !== undefined) {
                    const expiryTime = new Date(getSavedOtp.createdAt);
                    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
                    const currentTime = Date.now();
                    console.log(req.body.otp, getSavedOtp.otp, "two otps");
                    if (req.body.otp === getSavedOtp.otp &&
                        currentTime < expiryTime.getTime()) {
                        if (!req.body.purpose) {
                            yield this.interactor.setVerifiedTrue(req.body.userId);
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
                res.status(500).json({ status: 500, message: "Internal server error" });
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, mailer_1.default)(req.body.userId, req.body.otp);
                const saveOtp = yield this.interactor.saveOtp(req.body);
                if ((saveOtp === null || saveOtp === void 0 ? void 0 : saveOtp.status) === 200)
                    res.status(200).json({ status: 200 });
                else
                    res.status(400).json({ status: 400 });
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    // interface loginSubmitResponse {
    //   status: number;
    //   message: string;
    //   userData?: string;
    //   token?: string;
    // }
    loginSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                const verifyUser = yield this.interactor.verifyLoginUser(req.body);
                if ((verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.userData) !== undefined &&
                    verifyUser.ObjectId !== undefined &&
                    (verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.userData) !== null &&
                    (verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.status) === 201) {
                    const token = jwtUser_1.default.generateToken(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.userData, verifyUser.ObjectId);
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
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userEmail;
                const response = yield this.interactor.getUser(id);
                if ((response === null || response === void 0 ? void 0 : response.status) === 200)
                    console.log(response.data, "userdat>>>>>");
                res.status(201).json({ status: 201, user: response === null || response === void 0 ? void 0 : response.data });
                if ((response === null || response === void 0 ? void 0 : response.status) === 500)
                    res.status(500).json({ status: 500, user: null });
                if ((response === null || response === void 0 ? void 0 : response.status) === 404)
                    res.status(400).json({ status: 400, user: null });
            }
            catch (error) {
                res.status(500).json({ status: 500, user: null });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "req.body update");
                const userEmail = req.userEmail;
                const updateUser = yield this.interactor.updateUser(req.body, userEmail);
                if ((updateUser === null || updateUser === void 0 ? void 0 : updateUser.status) === 201)
                    res.status(201).json({ status: 201 });
                else
                    res.status(400).json({ status: 400 });
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    getJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = req.query.page;
                const jobsPerPage = req.query.jobsPerPage;
                let userEmail = "";
                if (req.userEmail)
                    userEmail = req.userEmail;
                const getJobs = yield this.interactor.getJobs(Number(pageNumber), Number(jobsPerPage), req.body, userEmail);
                if ((getJobs === null || getJobs === void 0 ? void 0 : getJobs.status) === 201)
                    res.status(201).json({
                        jobData: getJobs.data,
                        totalJobs: getJobs.totalPages,
                        status: 201,
                    });
                else
                    res.status(400).json({ jobData: null, totalJobs: null, status: 400 });
            }
            catch (error) {
                res.status(500).json({ jobData: null, totalJobs: null, status: 500 });
            }
        });
    }
    saveForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUserExists = yield this.interactor.checkUserExists(req.body.userId);
                if ((checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.status) === 200) {
                    (0, mailer_1.default)(req.body.userId, req.body.otp);
                    yield this.interactor.saveOtp(req.body);
                    res.status(201).json({ status: 201 });
                }
                else if ((checkUserExists === null || checkUserExists === void 0 ? void 0 : checkUserExists.status) === 404) {
                    res.status(404).json({ status: 404 });
                }
                else
                    res.status(400).json({ status: 400 });
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.resetPassword(req.body);
                if (response.status === 201)
                    res.status(201).json({ status: 201 });
                else
                    res.status(404).json({ status: 404 });
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    getJobData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.interactor.getJobData(id);
                if (response && response.status === 201)
                    res.json({ jobDataFetched: response.data, status: 201 });
                else
                    res.json({ jobDataFetched: null, status: 404 });
            }
            catch (error) {
                res.json({ jobDataFetched: null, status: 500 });
            }
        });
    }
    saveAppliedJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.userId;
                const userEmail = req.userEmail;
                const updatedBody = Object.assign(Object.assign({}, req.body), { userId: _id, userEmail: userEmail });
                const response = yield this.interactor.saveAppliedJob(updatedBody);
                if (response.status == 201)
                    res.json({ status: 201, appliedJob: response.appliedJob });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                res.json({ status: 500 });
            }
        });
    }
    followAndUnfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const response = yield this.interactor.followAndUnfollow(req.body.HRId, req.body.value, userId);
                if (response.status == 200)
                    res.status(200).send("Changed successfully");
                else
                    res.status(400).send("follow unfollow failed");
            }
            catch (error) {
                res.status(500);
            }
        });
    }
    downloadFileFromChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url: pdfHttpLink, fileName } = req.body;
                https_1.default
                    .get(pdfHttpLink, (pdfResponse) => {
                    console.log(fileName, "filename");
                    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                    res.setHeader("Content-Type", "application/pdf");
                    pdfResponse.pipe(res);
                })
                    .on("error", (err) => {
                    res.status(500).send("Error downloading PDF");
                });
            }
            catch (error) {
                res.status(500).send("Internal Server Error");
            }
        });
    }
    getPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.getPlans();
                if (response.status == 201)
                    res.json({ status: 201, planDatas: response.data });
                else
                    res.json({ status: 400, planDatas: null });
            }
            catch (error) {
                res.json({ status: 500, planDatas: null });
            }
        });
    }
    savePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.userId;
                const userEmail = req.userEmail;
                const response = yield this.interactor.savePayment(req.body, _id, userEmail);
                if (response)
                    res.status(200).send("Payment saved successfully");
                else
                    res.status(400).send("Bad Request");
            }
            catch (error) {
                res.status(500).send("Something Went wrong,try again");
            }
        });
    }
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_ID_KEY!,
    //   key_secret: process.env.RAZORPAY_SECRET_KEY!,
    // });
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const razorpay = new razorpay_1.default({
                    key_id: process.env.RAZORPAY_ID_KEY,
                    key_secret: process.env.RAZORPAY_SECRET_KEY,
                });
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
    }
    getPrevChatUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userEmail = req.userEmail;
                const response = yield this.interactor.getPrevChatUsers(userEmail);
                if (response.status === 201)
                    res.status(201).json({ chatData: response.data });
                else
                    res.status(404).json({ chatData: null });
            }
            catch (error) {
                res.status(500).json({ chatData: null });
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Utils_1.INTERFACE_TYPE.UserInteractor))
], UserController);
