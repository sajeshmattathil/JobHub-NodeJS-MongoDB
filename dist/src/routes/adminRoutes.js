"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const inversify_1 = require("inversify");
const Utils_1 = require("../../Utils");
const adminInteractor_1 = require("../interactors/adminInteractor");
const adminRepository_1 = require("../repositories/adminRepository");
const AdminController_1 = require("../controllers/AdminController");
const jwtAdmin_1 = __importDefault(require("../../Middleware/JWT/jwtAdmin"));
const container = new inversify_1.Container();
container.bind(Utils_1.INTERFACE_TYPE.AdminRepository).to(adminRepository_1.AdminRepository);
container.bind(Utils_1.INTERFACE_TYPE.AdminInteractor).to(adminInteractor_1.AdminInteractor);
container.bind(Utils_1.INTERFACE_TYPE.AdminController).to(AdminController_1.AdminController);
const adminController = container.get(Utils_1.INTERFACE_TYPE.AdminController);
router.get('/getAdmin', jwtAdmin_1.default.verifyToken, adminController.getAdmin.bind(adminController));
router.post('/login_submit', adminController.loginSubmit.bind(adminController));
router.get('/users', jwtAdmin_1.default.verifyToken, adminController.getAllUsers.bind(adminController));
router.patch('/blockandunblock', jwtAdmin_1.default.verifyToken, adminController.blockUnblockUser.bind(adminController));
router.get('/hiringmanagers', jwtAdmin_1.default.verifyToken, adminController.hiringManagers.bind(adminController));
router.get('/hiringmanagersApproved', jwtAdmin_1.default.verifyToken, adminController.hiringmanagersApproved.bind(adminController));
router.patch('/hrblockandunblock', jwtAdmin_1.default.verifyToken, adminController.blockUnblockHR.bind(adminController));
router.patch('/hrapprove', jwtAdmin_1.default.verifyToken, adminController.hrApprove.bind(adminController));
router.post('/saveNewPlan', jwtAdmin_1.default.verifyToken, adminController.saveNewPlan.bind(adminController));
router.get('/getPlans', jwtAdmin_1.default.verifyToken, adminController.getPlans.bind(adminController));
router.get('/getPlanData/:planId', jwtAdmin_1.default.verifyToken, adminController.getPlanData.bind(adminController));
router.post('/updatePlan/:planId', jwtAdmin_1.default.verifyToken, adminController.updatePlan.bind(adminController));
router.delete('/deletePlan/:id', jwtAdmin_1.default.verifyToken, adminController.deletePlan.bind(adminController));
router.get('/getDashboardData', jwtAdmin_1.default.verifyToken, adminController.getDashboardData.bind(adminController));
exports.default = router;
