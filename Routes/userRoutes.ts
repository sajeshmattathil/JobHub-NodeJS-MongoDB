import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'
import jwtUser from '../Middleware/JWT/jwtUser'

router.post('/signup_submit',userController.signupSubmit)
router.patch('/verifyOtp',userController.verifyOtp)
router.post('/resendOTP',userController.resendOTP)
router.post('/login_submit',userController.loginSubmit)
router.get('/getUser/:userId',userController.getUser)
router.put('/update',jwtUser.verifyToken,userController.updateUser)
router.get('/getJobs',userController.getJobs)
router.post('/forgot_password',userController.saveForgotOtp)
router.post('/verifyFortgotOtp',userController.verifyOtp)
router.put('/resetPassword',userController.resetPassword)
router.get('/getJobData/:id',userController.getJobData)
router.post('/applyJob',jwtUser.verifyToken,userController.saveAppliedJob)
router.patch('/followAndUnfollow',jwtUser.verifyToken,userController.followAndUnfollow)

export default router