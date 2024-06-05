import express from 'express'
const router = express.Router()
import { Container } from 'inversify'
import { IUserRepository } from '../interfaces/IUserRepository'
import { INTERFACE_TYPE } from '../../Utils'
import { UserRepository } from '../repositories/userRepository'
import { IUserInteractors } from '../interfaces/IUserInteractors'
import { UserController } from '../controllers/UserController'
import jwtUser from '../../Middleware/JWT/jwtUser'
import chatController from '../../Chat/chatController'
import { UserInteractor } from '../interactors/userInteractor'

const container = new Container()
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository)
container.bind<IUserInteractors>(INTERFACE_TYPE.UserInteractor).to(UserInteractor)
container.bind(INTERFACE_TYPE.UserController).to(UserController)

const userController = container.get<UserController>(INTERFACE_TYPE.UserController)

router.post('/signup_submit',userController.signupSubmit.bind(userController))
router.patch('/verifyOtp',userController.verifyOtp.bind(userController))
router.post('/resendOTP',userController.resendOTP.bind(userController))
router.post('/login_submit',userController.loginSubmit.bind(userController))
router.get('/getUser',jwtUser.verifyToken,userController.getUser.bind(userController))
router.put('/update',jwtUser.verifyToken,userController.updateUser.bind(userController))
router.post('/getJobs',userController.getJobs.bind(userController))
router.post('/forgot_password',userController.saveForgotOtp.bind(userController))
router.post('/verifyFortgotOtp',userController.verifyOtp.bind(userController))
router.put('/resetPassword',userController.resetPassword.bind(userController))
router.get('/getJobData/:id',userController.getJobData.bind(userController))
router.post('/applyJob',jwtUser.verifyToken,userController.saveAppliedJob.bind(userController))
router.patch('/followAndUnfollow',jwtUser.verifyToken,userController.followAndUnfollow.bind(userController))
router.post('/downloadFile',jwtUser.verifyToken,userController.downloadFileFromChat.bind(userController))
router.get('/getChat',jwtUser.verifyToken,chatController.getChat.bind(userController).bind(userController))
router.get('/getPlans',jwtUser.verifyToken,userController.getPlans.bind(userController))
router.post('/savePayment',jwtUser.verifyToken,userController.savePayment.bind(userController))
router.post('/create-order',jwtUser.verifyToken,userController.createOrder.bind(userController))
router.get('/getPrevChatUsers',jwtUser.verifyToken,userController.getPrevChatUsers.bind(userController))

export default router
