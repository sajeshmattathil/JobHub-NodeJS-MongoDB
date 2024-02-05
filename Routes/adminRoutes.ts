import express from 'express'
import adminController from '../Controller/adminController'
const router = express.Router()

router.post('/login_submit',adminController.loginSubmit)
router.get('/users',adminController.getAllUsers)
router.put('/blockandunblock_user',adminController.blockUnblockUser)

export default router