import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'
import jwtUser from '../Middleware/JWT/jwtUser'

router.post('/signup_submit',userController.signupSubmit)
router.post('/verifyOtp',userController.verifyOtp)
router.post('/resendOTP',userController.resendOTP)
router.post('/login_submit',userController.loginSubmit)
router.get('/getUser/:userId',userController.getUser)
router.post('/update',userController.updateUser)
router.get('/getJobs',jwtUser.verifyToken,userController.getJobs)


export default router