import express from 'express'
import adminController from '../Controller/adminController'
import jwtAdmin from '../Middleware/JWT/jwtAdmin'
const router = express.Router()

router.get('/getAdmin',jwtAdmin.verifyToken,adminController.getAdmin)
router.post('/login_submit',adminController.loginSubmit)
router.get('/users',jwtAdmin.verifyToken,adminController.getAllUsers)
router.patch('/blockandunblock',jwtAdmin.verifyToken,adminController.blockUnblockUser)
router.get('/hiringmanagers',jwtAdmin.verifyToken,adminController.hiringManagers)
router.get('/hiringmanagersApproved',jwtAdmin.verifyToken,adminController.hiringmanagersApproved)
router.patch('/hrblockandunblock',jwtAdmin.verifyToken,adminController.blockUnblockHR)
router.patch('/hrapprove',jwtAdmin.verifyToken,adminController.hrApprove)
router.post('/saveNewPlan',jwtAdmin.verifyToken,adminController.saveNewPlan)
router.get('/getPlans',jwtAdmin.verifyToken,adminController.getPlans)
router.get('/getPlanData/:planId',jwtAdmin.verifyToken,adminController.getPlanData)
router.post('/updatePlan/:planId',jwtAdmin.verifyToken,adminController.updatePlan)
router.delete('/deletePlan/:id',jwtAdmin.verifyToken,adminController.deletePlan)
router.get('/getDashboardData',jwtAdmin.verifyToken,adminController.getDashboardData)

export default router