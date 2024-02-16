import express from 'express'
import adminController from '../Controller/adminController'
const router = express.Router()

router.post('/login_submit',adminController.loginSubmit)
router.get('/users',adminController.getAllUsers)
router.put('/blockandunblock',adminController.blockUnblockUser)
router.get('/hiringmanagers',adminController.hiringManagers)
router.put('/hrblockandunblock',adminController.blockUnblockHR)
router.put('/hrapprove',adminController.hrApprove)




export default router