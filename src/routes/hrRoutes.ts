import express from 'express'
const router = express.Router()
import { Container } from 'inversify'
import { INTERFACE_TYPE } from '../../Utils'

import chatController from '../../Controller/chatController'
import { HRRepository } from '../repositories/hrRepository'
import { IHRRepository } from '../interfaces/IHRRepository'
import { IHRInteractor } from '../interfaces/IHRInteractor'
import { HRInteractor } from '../interactors/hrInteractor'
import { HRController } from '../controllers/HRController'
import jwtHR from '../../Middleware/JWT/jwtHR'

const container = new Container()
container.bind<IHRRepository>(INTERFACE_TYPE.HRRepository).to(HRRepository)
container.bind<IHRInteractor>(INTERFACE_TYPE.HRInteractor).to(HRInteractor)
container.bind(INTERFACE_TYPE.HRController).to(HRController)

const hrController = container.get<HRController>(INTERFACE_TYPE.HRController)

router.post('/signup_submit',hrController.hrSignup.bind(hrController))
router.post('/verifyOtp',hrController.verifyOtp.bind(hrController))
router.post('/login_submit',hrController.hrLogin.bind(hrController))
router.post('/createJOb',jwtHR.verifyToken,hrController.createJob.bind(hrController))
router.get('/getJobs/:id',jwtHR.verifyToken,hrController.getJobs.bind(hrController))
router.get('/getHR',jwtHR.verifyToken,hrController.getHR.bind(hrController))
router.post('/update/:id',jwtHR.verifyToken,hrController.updateProfile.bind(hrController))
router.get('/getJobDetails/:id',jwtHR.verifyToken,hrController.getJobDetails.bind(hrController))
router.delete('/deleteJob/:id',jwtHR.verifyToken,hrController.deleteJob.bind(hrController))
router.post('/updateJob',jwtHR.verifyToken,hrController.updateJob.bind(hrController))
router.patch('/updateJobpostHRViewed/:id',jwtHR.verifyToken,hrController.updateJobpostHRViewed.bind(hrController))
router.post('/downloadFile',hrController.downloadFileFromChat.bind(hrController))
router.patch('/shortListUser',jwtHR.verifyToken,hrController.shortListUser)
router.get('/shortListedUsers/:jobId',jwtHR.verifyToken,hrController.getShortListedUsers.bind(hrController))
router.get('/getChat',jwtHR.verifyToken,chatController.getChat.bind(hrController))
router.patch('/removeFromShortListed',jwtHR.verifyToken,hrController.removeFromShortListed.bind(hrController))
router.get('/getPrevChatUsers',jwtHR.verifyToken,hrController.getPrevChatUsers.bind(hrController))
router.get('/getFollowers',jwtHR.verifyToken,hrController.getFollowers.bind(hrController))

export default router
