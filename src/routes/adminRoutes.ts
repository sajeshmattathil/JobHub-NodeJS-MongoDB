// import express from 'express'
// const router = express.Router()
// import { Container } from 'inversify'
// import { INTERFACE_TYPE } from '../../Utils'
// import { AdminInteractor } from '../interactors/adminInteractor'
// import { AdminRepository } from '../repositories/adminRepository'
// import { AdminController } from '../controllers/AdminController'
// import { IAdminRepository } from '../interfaces/IAdminRepository'
// import { IAdminInteractor } from '../interfaces/IAdminInteractor'
// import jwtAdmin from '../../Middleware/JWT/jwtAdmin'

// const container = new Container()
// container.bind<IAdminRepository>(INTERFACE_TYPE.AdminRepository).to(AdminRepository)
// container.bind<IAdminInteractor>(INTERFACE_TYPE.AdminInteractor).to(AdminInteractor)
// container.bind(INTERFACE_TYPE.AdminController).to(AdminController)

// const adminController = container.get<AdminController>(INTERFACE_TYPE.AdminController)

// router.get('/getAdmin',jwtAdmin.verifyToken,adminController.getAdmin.bind(adminController))
// router.post('/login_submit',adminController.loginSubmit.bind(adminController))
// router.get('/users',jwtAdmin.verifyToken,adminController.getAllUsers.bind(adminController))
// router.patch('/blockandunblock',jwtAdmin.verifyToken,adminController.blockUnblockUser.bind(adminController))
// router.get('/hiringmanagers',jwtAdmin.verifyToken,adminController.hiringManagers.bind(adminController))
// router.get('/hiringmanagersApproved',jwtAdmin.verifyToken,adminController.hiringmanagersApproved.bind(adminController))
// router.patch('/hrblockandunblock',jwtAdmin.verifyToken,adminController.blockUnblockHR.bind(adminController))
// router.patch('/hrapprove',jwtAdmin.verifyToken,adminController.hrApprove.bind(adminController))
// router.post('/saveNewPlan',jwtAdmin.verifyToken,adminController.saveNewPlan.bind(adminController))
// router.get('/getPlans',jwtAdmin.verifyToken,adminController.getPlans.bind(adminController))
// router.get('/getPlanData/:planId',jwtAdmin.verifyToken,adminController.getPlanData.bind(adminController))
// router.post('/updatePlan/:planId',jwtAdmin.verifyToken,adminController.updatePlan.bind(adminController))
// router.delete('/deletePlan/:id',jwtAdmin.verifyToken,adminController.deletePlan.bind(adminController))
// router.get('/getDashboardData',jwtAdmin.verifyToken,adminController.getDashboardData.bind(adminController))

// export default router
