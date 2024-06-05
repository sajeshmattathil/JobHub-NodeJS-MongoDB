"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = __importDefault(require("../Controller/userController"));
const jwtUser_1 = __importDefault(require("../Middleware/JWT/jwtUser"));
const chatController_1 = __importDefault(require("../Chat/chatController"));
router.post('/signup_submit', userController_1.default.signupSubmit);
router.patch('/verifyOtp', userController_1.default.verifyOtp);
router.post('/resendOTP', userController_1.default.resendOTP);
router.post('/login_submit', userController_1.default.loginSubmit);
router.get('/getUser', jwtUser_1.default.verifyToken, userController_1.default.getUser);
router.put('/update', jwtUser_1.default.verifyToken, userController_1.default.updateUser);
router.post('/getJobs', userController_1.default.getJobs);
router.post('/forgot_password', userController_1.default.saveForgotOtp);
router.post('/verifyFortgotOtp', userController_1.default.verifyOtp);
router.put('/resetPassword', userController_1.default.resetPassword);
router.get('/getJobData/:id', userController_1.default.getJobData);
router.post('/applyJob', jwtUser_1.default.verifyToken, userController_1.default.saveAppliedJob);
router.patch('/followAndUnfollow', jwtUser_1.default.verifyToken, userController_1.default.followAndUnfollow);
router.post('/downloadFile', jwtUser_1.default.verifyToken, userController_1.default.downloadFileFromChat);
router.get('/getChat', jwtUser_1.default.verifyToken, chatController_1.default.getChat);
router.get('/getPlans', jwtUser_1.default.verifyToken, userController_1.default.getPlans);
router.post('/savePayment', jwtUser_1.default.verifyToken, userController_1.default.savePayment);
router.post('/create-order', jwtUser_1.default.verifyToken, userController_1.default.createOrder);
router.get('/getPrevChatUsers', jwtUser_1.default.verifyToken, userController_1.default.getPrevChatUsers);
exports.default = router;
