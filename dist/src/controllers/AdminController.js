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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
const jwtAdmin_1 = __importDefault(require("../../Middleware/JWT/jwtAdmin"));
let AdminController = class AdminController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    loginSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyAdmin = yield this.interactor.verifyLoginAdmin(req.body);
                if (verifyAdmin === null || verifyAdmin === void 0 ? void 0 : verifyAdmin.adminData) {
                    const token = jwtAdmin_1.default.generateToken(verifyAdmin.adminData);
                    res.status(201).json({
                        status: 201,
                        message: "User verification successful",
                        adminData: verifyAdmin.adminData,
                        token: token,
                    });
                }
                else if (verifyAdmin.status === 401) {
                    res.status(401).json({
                        status: 401,
                        message: "Admin login failed. Invalid credentials.",
                    });
                }
                else {
                    res.status(404).json({
                        status: 404,
                        message: "Admin login failed. Invalid credentials.",
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "Something went wrong, try again ",
                });
            }
        });
    }
    getAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.adminId;
                const response = yield this.interactor.getAdmin(id);
                if ((response === null || response === void 0 ? void 0 : response.status) === 201) {
                    res.status(201).json({ status: 201, admin: response === null || response === void 0 ? void 0 : response.data });
                }
                if ((response === null || response === void 0 ? void 0 : response.status) === 500)
                    res.status(500).json({ status: 500, admin: null });
                if ((response === null || response === void 0 ? void 0 : response.status) === 400)
                    res.status(400).json({ status: 400, admin: null });
            }
            catch (error) {
                res.status(500).json({ status: 500, admin: null });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.getAllUsers();
                if (response.status === 201)
                    res.status(201).json({ usersData: response, status: 201 });
                else if (response.status === 500)
                    res.status(500).json({ usersData: null, status: 500 });
                else
                    res.status(404).json({ usersData: null, status: 404 });
            }
            catch (error) {
                res.status(500).json({ usersData: null, status: 500 });
            }
        });
    }
    blockUnblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.blockUblockUser(req.body.email, req.body.isBlocked);
                if (response.status === 201) {
                    res.status(201).json({ status: 201 });
                }
                else {
                    res.status(404).json({ status: 404 });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    hiringManagers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = req.query.page;
                const HRsPerPage = req.query.jobsPerPage;
                const response = yield this.interactor.getHiringManagers(Number(pageNumber), Number(HRsPerPage));
                if (response !== undefined) {
                    if (response.status === 201) {
                        res.status(201).json({
                            status: 201,
                            HRData: response === null || response === void 0 ? void 0 : response.data,
                            totalJobs: response.totalPages,
                        });
                    }
                    else if (response.status === 500)
                        res.status(500).json({ status: 500, HRData: null, totalJobs: null });
                    else
                        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, HRData: null, totalJobs: null });
            }
        });
    }
    hiringmanagersApproved(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = req.query.page;
                const HRsPerPage = req.query.jobsPerPage;
                const response = yield this.interactor.getHiringManagersApproved(Number(pageNumber), Number(HRsPerPage));
                if (response !== undefined) {
                    if (response.status === 201) {
                        res.status(201).json({
                            status: 201,
                            HRData: response === null || response === void 0 ? void 0 : response.data,
                            totalJobs: response.totalPages,
                        });
                    }
                    else if (response.status === 500)
                        res.status(500).json({ status: 500, HRData: null, totalJobs: null });
                    else
                        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, HRData: null, totalJobs: null });
            }
        });
    }
    blockUnblockHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.blockUnblockHR(req.body.email, req.body.isBlocked);
                if (response.status === 201) {
                    res.status(201).json({ status: 201 });
                }
                else {
                    res.status(404).json({ status: 404 });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    hrApprove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.hrApprove(req.body.email);
                if (response.status === 201) {
                    res.status(201).json({ status: 201 });
                }
                else {
                    res.status(404).json({ status: 404 });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500 });
            }
        });
    }
    saveNewPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.saveNewPlan(req.body);
                if (response.status === 200)
                    res.json({ status: 200 });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                res.json({ status: 500 });
            }
        });
    }
    getPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.interactor.getPlans();
                if (response.status === 201)
                    res.json({ status: 201, planDatas: response.data });
                else
                    res.json({ status: 400, planDatas: null });
            }
            catch (error) {
                res.json({ status: 500, planDatas: null });
            }
        });
    }
    getPlanData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { planId } = req.params;
                const response = yield this.interactor.getPlanData(String(planId));
                if (response.status === 201)
                    res.json({ status: 201, planData: response.data });
                else
                    res.json({ status: 400, planData: null });
            }
            catch (error) {
                console.log("error happened in get plan data in admincontroller");
                res.json({ status: 500, planData: null });
            }
        });
    }
    updatePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { planId } = req.params;
                const response = yield this.interactor.updatePlan(String(planId), req.body);
                if (response.status === 201)
                    res.json({ status: 201 });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                res.json({ status: 500 });
            }
        });
    }
    deletePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.interactor.deletePlan(String(id));
                if (response.status === 200)
                    res.json({ status: 200 });
                else
                    res.json({ status: 400 });
            }
            catch (error) {
                res.json({ status: 500 });
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield this.interactor.getAllDashboardData();
                if (dashboardData.status === 202)
                    res.status(202).json({ dashboardData: dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.data });
                else
                    res.status(404).json({ message: dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.error });
            }
            catch (error) {
                res.status(500).json({ message: "Something went wrong!" });
            }
        });
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Utils_1.INTERFACE_TYPE.AdminInteractor))
], AdminController);
