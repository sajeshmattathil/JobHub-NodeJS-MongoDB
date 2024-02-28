import express from 'express'
import adminController from '../Controller/adminController'
const router = express.Router()

router.post('/login_submit',adminController.loginSubmit)
router.get('/users',adminController.getAllUsers)
router.patch('/blockandunblock',adminController.blockUnblockUser)
router.get('/hiringmanagers',adminController.hiringManagers)
router.get('/hiringmanagersApproved',adminController.hiringmanagersApproved)

router.patch('/hrblockandunblock',adminController.blockUnblockHR)
router.patch('/hrapprove',adminController.hrApprove)

export default router