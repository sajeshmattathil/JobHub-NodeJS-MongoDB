"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AdminRepository = void 0;
const mongodb_1 = require("mongodb");
const admin_1 = __importDefault(require("../../Model/admin"));
const hr_1 = __importDefault(require("../../Model/hr"));
const plan_1 = __importDefault(require("../../Model/plan"));
const user_1 = __importDefault(require("../../Model/user"));
const transactions_1 = __importDefault(require("../../Model/transactions"));
const inversify_1 = require("inversify");
let AdminRepository = class AdminRepository {
    constructor() {
        this.userModel = user_1.default;
        this.adminModel = admin_1.default;
        this.hrModel = hr_1.default;
        this.transactionModel = transactions_1.default;
        this.planModel = plan_1.default;
    }
    findAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this.adminModel.findOne({ email: email });
                return adminData;
            }
            catch (error) {
                console.error("Error finding admin:", error);
                return null;
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel.find({ isVerified: true });
            }
            catch (error) {
                console.error("Error getting all users:", error);
                return [];
            }
        });
    }
    blockUblockUser(email, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel.updateOne({ email: email }, { $set: { isBlocked: !isBlocked } });
            }
            catch (error) {
                console.error("Error blocking/unblocking user:", error);
                return null;
            }
        });
    }
    getHiringManagers(pageNumber, HRsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.find({ isApproved: false })
                    .skip(HRsPerPage * (pageNumber - 1))
                    .limit(HRsPerPage);
            }
            catch (error) {
                console.error("Error getting hiring managers:", error);
                return [];
            }
        });
    }
    HRCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.countDocuments({ isApproved: false });
            }
            catch (error) {
                console.error("Error getting HR count:", error);
                return null;
            }
        });
    }
    getHiringManagersApproved(pageNumber, HRsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.find({ isApproved: true })
                    .skip(HRsPerPage * (pageNumber - 1))
                    .limit(HRsPerPage);
            }
            catch (error) {
                console.error("Error getting approved hiring managers:", error);
                return [];
            }
        });
    }
    HRCountApproved() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.countDocuments({ isApproved: true });
            }
            catch (error) {
                console.error("Error getting approved HR count:", error);
                return null;
            }
        });
    }
    blockUblockHR(email, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.updateOne({ email: email }, { $set: { isBlocked: !isBlocked } });
            }
            catch (error) {
                console.error("Error blocking/unblocking HR:", error);
                return null;
            }
        });
    }
    hrApprove(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.updateOne({ email: email }, { $set: { isApproved: true } });
            }
            catch (error) {
                console.error("Error approving HR:", error);
                return null;
            }
        });
    }
    getPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planModel.find({ isActive: true });
            }
            catch (error) {
                console.error("Error getting plans:", error);
                return [];
            }
        });
    }
    getPlanData(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planModel.findOne({ _id: new mongodb_1.ObjectId(planId) });
            }
            catch (error) {
                console.error("Error getting plan data:", error);
                return null;
            }
        });
    }
    updatePlan(planId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planModel.updateOne({ _id: planId }, {
                    $set: {
                        amount: body.amount,
                        planName: body.planName,
                        duration: body.duration,
                    },
                });
            }
            catch (error) {
                console.error("Error updating plan:", error);
                return null;
            }
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planModel.updateOne({ _id: id }, { $set: { isActive: false } });
            }
            catch (error) {
                console.error("Error deleting plan:", error);
                return null;
            }
        });
    }
    findUsersTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel.countDocuments({ isBlocked: false });
            }
            catch (error) {
                console.error("Error finding total users:", error);
                return null;
            }
        });
    }
    findHRTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.hrModel.countDocuments({ isApproved: true });
            }
            catch (error) {
                console.error("Error finding total HR:", error);
                return null;
            }
        });
    }
    findTotalActiveSubcribers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userModel.countDocuments({ "subscription.isSubscribed": true });
            }
            catch (error) {
                console.error("Error finding total active subscribers:", error);
                return null;
            }
        });
    }
    findTotalRevenueGenerated() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transactionModel.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: '$amount' }
                        }
                    }
                ]);
            }
            catch (error) {
                console.error("Error finding total revenue generated:", error);
                return null;
            }
        });
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, inversify_1.injectable)()
], AdminRepository);
