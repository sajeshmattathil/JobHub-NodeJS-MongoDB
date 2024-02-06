import express from 'express'
import adminController from '../Controller/adminController'
const router = express.Router()

router.post('/login_submit',adminController.loginSubmit)
router.get('/users',adminController.getAllUsers)
router.put('/blockandunblock',adminController.blockUnblockUser)

export default router