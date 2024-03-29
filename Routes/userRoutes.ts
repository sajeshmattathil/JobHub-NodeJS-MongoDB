import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'
import jwtUser from '../Middleware/JWT/jwtUser'
import chatController from '../Controller/chatController'

router.post('/signup_submit',userController.signupSubmit)
router.patch('/verifyOtp',userController.verifyOtp)
router.post('/resendOTP',userController.resendOTP)
router.post('/login_submit',userController.loginSubmit)
router.get('/getUser',jwtUser.verifyToken,userController.getUser)
router.put('/update',jwtUser.verifyToken,userController.updateUser)
router.post('/getJobs',userController.getJobs)
router.post('/forgot_password',userController.saveForgotOtp)
router.post('/verifyFortgotOtp',userController.verifyOtp)
router.put('/resetPassword',userController.resetPassword)
router.get('/getJobData/:id',userController.getJobData)
router.post('/applyJob',jwtUser.verifyToken,userController.saveAppliedJob)
router.patch('/followAndUnfollow',jwtUser.verifyToken,userController.followAndUnfollow)
router.post('/downloadFile',jwtUser.verifyToken,userController.downloadFileFromChat)
router.get('/getChat',jwtUser.verifyToken,chatController.getChat)
router.get('/getPlans',jwtUser.verifyToken,userController.getPlans)
router.post('/savePayment',jwtUser.verifyToken,userController.savePayment)
router.post('/create-order',jwtUser.verifyToken,userController.createOrder)

export default router