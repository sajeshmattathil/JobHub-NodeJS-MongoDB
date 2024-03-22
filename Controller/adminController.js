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
const adminService_1 = __importDefault(require("../Service/adminService"));
const jwtAdmin_1 = __importDefault(require("../Middleware/JWT/jwtAdmin"));
const loginSubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "body");
        const verifyAdmin = yield adminService_1.default.verifyLoginAdmin(req.body);
        console.log(verifyAdmin, "verify user");
        if (verifyAdmin === null || verifyAdmin === void 0 ? void 0 : verifyAdmin.adminData) {
            const token = jwtAdmin_1.default.generateToken(verifyAdmin.adminData);
            res.status(201).json({
                status: 201,
                message: "User verification successful",
                adminData: verifyAdmin.adminData,
                token: token,
            });
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Admin login failed. Invalid credentials.",
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminService_1.default.getAllUsers();
        console.log(response, "response");
        if (response)
            res.status(201).json({ usersData: response, status: 201 });
        else
            res.status(404).json({ usersData: null, status: 404 });
    }
    catch (error) {
        res.status(500).json({ usersData: null, status: 500 });
    }
});
const blockUnblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminService_1.default.blockUblockUser(req.body.email, req.body.isBlocked);
        console.log(response, "blockREsoponse");
        if (response.message) {
            res.status(201).json({ status: 201 });
        }
        else {
            res.status(404).json({ status: 404 });
        }
    }
    catch (error) {
        console.log("error in block user in controller");
    }
});
const hiringManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageNumber = req.query.page;
        const HRsPerPage = req.query.jobsPerPage;
        const response = yield adminService_1.default.getHiringManagers(Number(pageNumber), Number(HRsPerPage));
        console.log(response, "hrs response controller");
        if (response !== undefined) {
            if (response.message === "success") {
                res.status(201).json({
                    status: 201,
                    HRData: response === null || response === void 0 ? void 0 : response.data,
                    totalJobs: response.totalPages,
                });
            }
            else
                res.status(404).json({ status: 404, HRData: null, totalJobs: null });
        }
    }
    catch (error) {
        console.log("error happened in fetching HR data in admincontroller");
        res.status(500).json({ status: 500, HRData: null, totalJobs: null });
    }
});
const hiringmanagersApproved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageNumber = req.query.page;
        const HRsPerPage = req.query.jobsPerPage;
        const response = yield adminService_1.default.getHiringManagersApproved(Number(pageNumber), Number(HRsPerPage));
        console.log(response, "hrs response controller");
        if (response !== undefined) {
            if (response.message === "success") {
                res.status(201).json({
                    status: 201,
                    HRData: response === null || response === void 0 ? void 0 : response.data,
                    totalJobs: response.totalPages,
                });
            }
            else
                res.status(404).json({ status: 404, HRData: null, totalJobs: null });
        }
    }
    catch (error) {
        console.log("error happened in fetching HR data in admincontroller");
        res.status(500).json({ status: 500, HRData: null, totalJobs: null });
    }
});
const blockUnblockHR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminService_1.default.blockUnblockHR(req.body.email, req.body.isBlocked);
        console.log(response, "HRblockREsoponse");
        if (response.message) {
            res.status(201).json({ status: 201 });
        }
        else {
            res.status(404).json({ status: 404 });
        }
    }
    catch (error) { }
});
const hrApprove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminService_1.default.hrApprove(req.body.email);
        console.log(response, "HRblockREsoponse");
        if (response.message) {
            res.status(201).json({ status: 201 });
        }
        else {
            res.status(404).json({ status: 404 });
        }
    }
    catch (error) { }
});
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.adminId;
        console.log(id, "getadmin --- id");
        const response = yield adminService_1.default.getAdmin(id);
        console.log(response, "getadmin --- response");
        if ((response === null || response === void 0 ? void 0 : response.message) === "success") {
            res.status(201).json({ status: 201, admin: response === null || response === void 0 ? void 0 : response.data });
        }
        if ((response === null || response === void 0 ? void 0 : response.message) === "error")
            res.status(500).json({ status: 500, admin: null });
        if ((response === null || response === void 0 ? void 0 : response.message) === "Not found")
            res.status(400).json({ status: 400, admin: null });
    }
    catch (error) {
        console.log("Something went wrong", error);
    }
});
const saveNewPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "req.body");
        const response = yield adminService_1.default.saveNewPlan(req.body);
        console.log(response, "response---plan");
        if ((response.message = "success"))
            res.json({ status: 200 });
        else
            res.json({ status: 400 });
    }
    catch (error) {
        console.log("error happened in saving plan data in admincontroller");
        res.json({ status: 500 });
    }
});
const getPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminService_1.default.getPlans();
        console.log(response, "response---getplans");
        if ((response.message === "success"))
            res.json({ status: 201, planDatas: response.data });
        else
            res.json({ status: 400, planDatas: null });
    }
    catch (error) {
        console.log("error happened in get all plan data in admincontroller");
        res.json({ status: 500, planDatas: null });
    }
});
const getPlanData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.params;
        console.log(planId, "id----");
        const response = yield adminService_1.default.getPlanData(String(planId));
        console.log(response, "response--- plan one");
        if ((response.message = "success"))
            res.json({ status: 201, planData: response.data });
        else
            res.json({ status: 400, planData: null });
    }
    catch (error) {
        console.log("error happened in get plan data in admincontroller");
        res.json({ status: 500, planData: null });
    }
});
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.params;
        console.log(planId, "id----");
        const response = yield adminService_1.default.updatePlan(String(planId), req.body);
        if ((response.message = "success"))
            res.json({ status: 201 });
        else
            res.json({ status: 400 });
    }
    catch (error) {
        console.log("error happened in update plan data in admincontroller");
        res.json({ status: 500 });
    }
});
const deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, "id----");
        const response = yield adminService_1.default.deletePlan(String(id));
        if ((response.message = "success"))
            res.json({ status: 200 });
        else
            res.json({ status: 400 });
    }
    catch (error) {
        res.json({ status: 500 });
    }
});
exports.default = {
    getAdmin,
    loginSubmit,
    getAllUsers,
    blockUnblockUser,
    hiringManagers,
    hiringmanagersApproved,
    blockUnblockHR,
    hrApprove,
    saveNewPlan,
    getPlans,
    getPlanData,
    updatePlan,
    deletePlan
};
