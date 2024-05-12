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
exports.AdminInteractor = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const plan_1 = __importDefault(require("../../Model/plan"));
const inversify_1 = require("inversify");
const adminRepository_1 = require("../repositories/adminRepository");
let AdminInteractor = class AdminInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    verifyLoginAdmin(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminDetails = yield this.repository.findAdmin(body.email);
                if (adminDetails) {
                    const comparePsw = yield bcrypt_1.default.compare(body.password, adminDetails.password);
                    if (comparePsw)
                        return { adminData: adminDetails.email, status: 201 };
                    else
                        return { adminData: null, status: 401 };
                }
                else {
                    return { adminData: null, status: 404 };
                }
            }
            catch (error) {
                console.log(error);
                return { adminData: null, status: 500 };
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllUsers = yield this.repository.getAllUsers();
                if (getAllUsers === null || getAllUsers === void 0 ? void 0 : getAllUsers.length) {
                    return { status: 201, data: getAllUsers };
                }
                else {
                    return { status: 404, data: null };
                }
            }
            catch (error) {
                return { status: 500, data: null };
            }
        });
    }
    blockUblockUser(email, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockUblockUser = yield this.repository.blockUblockUser(email, isBlocked);
                if (blockUblockUser)
                    return { status: 201 };
                else
                    return { status: 404 };
            }
            catch (error) {
                console.log("Error in block n unblock", error);
                return { status: 500 };
            }
        });
    }
    getHiringManagers(pageNumber, HRsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const HRCount = yield this.repository.HRCount();
                const getHiringManagers = yield this.repository.getHiringManagers(pageNumber, HRsPerPage);
                if (getHiringManagers !== undefined) {
                    if (getHiringManagers.length)
                        return { status: 201, data: getHiringManagers, totalPages: HRCount };
                }
                else {
                    return { status: 404, data: null, totalPages: null };
                }
                return { status: 400, data: null, totalPages: null };
            }
            catch (error) {
                return { status: 500, data: null, totalPages: null };
            }
        });
    }
    getHiringManagersApproved(pageNumber, HRsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const HRCount = yield this.repository.HRCountApproved();
                const getHiringManagers = yield this.repository.getHiringManagersApproved(pageNumber, HRsPerPage);
                if (getHiringManagers !== undefined) {
                    if (getHiringManagers.length)
                        return { status: 201, data: getHiringManagers, totalPages: HRCount };
                }
                else {
                    return { status: 404, data: null, totalPages: null };
                }
                return { status: 400, data: null, totalPages: null };
            }
            catch (error) {
                return { status: 500, data: null, totalPages: null };
            }
        });
    }
    blockUnblockHR(email, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockUblockHR = yield this.repository.blockUblockHR(email, isBlocked);
                if (blockUblockHR)
                    return { status: 201 };
                else
                    return { status: 404 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    hrApprove(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hrApprove = yield this.repository.hrApprove(email);
                if (hrApprove)
                    return { status: 201 };
                else
                    return { status: 404 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    getAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this.repository.findAdmin(id);
                if (adminData && (adminData === null || adminData === void 0 ? void 0 : adminData.password) !== undefined) {
                    adminData.password = "";
                    return { data: adminData, status: 201 };
                }
                else
                    return { data: null, status: 404 };
            }
            catch (error) {
                return { data: null, status: 500 };
            }
        });
    }
    saveNewPlan(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPlan = new plan_1.default(body);
                yield newPlan.save();
                if (newPlan)
                    return { status: 200 };
                else
                    return { status: 400 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    getPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getPlanDatas = yield this.repository.getPlans();
                if (getPlanDatas && getPlanDatas.length) {
                    return { status: 201, data: getPlanDatas };
                }
                else {
                    return { status: 404, data: null };
                }
            }
            catch (error) {
                return { status: 500, data: null };
            }
        });
    }
    getPlanData(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getPlanData = yield this.repository.getPlanData(planId);
                if (getPlanData && Object.keys(getPlanData).length) {
                    return { status: 201, data: getPlanData };
                }
                else
                    return { status: 400, data: null };
            }
            catch (error) {
                return { status: 500, data: null };
            }
        });
    }
    updatePlan(planId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUpdatedData = yield this.repository.updatePlan(planId, body);
                if (getUpdatedData) {
                    return { status: 201 };
                }
                else
                    return { status: 400 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getDeletedData = yield this.repository.deletePlan(id);
                if (getDeletedData) {
                    return { status: 201 };
                }
                else
                    return { status: 400 };
            }
            catch (error) {
                return { status: 500 };
            }
        });
    }
    getAllDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalNumberOfUsers, totalNumberOfHR, totalActiveSubscribers, totalRevenueGenerated,] = yield Promise.all([
                    this.repository.findUsersTotal(),
                    this.repository.findHRTotal(),
                    this.repository.findTotalActiveSubcribers(),
                    this.repository.findTotalRevenueGenerated(),
                ]);
                if (totalNumberOfUsers !== null &&
                    totalNumberOfHR !== null &&
                    totalActiveSubscribers !== null &&
                    totalRevenueGenerated !== null) {
                    return {
                        status: 202,
                        data: {
                            totalUsers: totalNumberOfUsers,
                            totalHR: totalNumberOfHR,
                            activeSubscribers: totalActiveSubscribers,
                            totalRevenue: totalRevenueGenerated[0].totalAmount,
                        },
                    };
                }
                else {
                    return {
                        status: 404,
                        error: "Some data could not be retrieved",
                        data: null
                    };
                }
            }
            catch (error) {
                return {
                    status: 500,
                    error: "An error occurred while fetching data",
                    data: null
                };
            }
        });
    }
};
exports.AdminInteractor = AdminInteractor;
exports.AdminInteractor = AdminInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(adminRepository_1.AdminRepository))
], AdminInteractor);
