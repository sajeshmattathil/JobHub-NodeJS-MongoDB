import express from 'express'
const router = express.Router()
import hrController from '../Controller/hrController'
import jwtHR from '../Middleware/JWT/jwtHR'
import chatController from '../Controller/chatController'

router.post('/signup_submit',hrController.hrSignup)
router.post('/verifyOtp',hrController.verifyOtp)
router.post('/login_submit',hrController.hrLogin)
router.post('/createJOb',jwtHR.verifyToken,hrController.createJOb)
router.get('/getJobs/:id',jwtHR.verifyToken,hrController.getJobs)
router.get('/getHR',jwtHR.verifyToken,hrController.getHR)
router.post('/update/:id',jwtHR.verifyToken,hrController.updateProfile)
router.get('/getJobDetails/:id',jwtHR.verifyToken,hrController.getJobDetails)
router.delete('/deleteJob/:id',jwtHR.verifyToken,hrController.deleteJob)
router.post('/updateJob',jwtHR.verifyToken,hrController.updateJob)
router.patch('/updateJobpostHRViewed/:id',jwtHR.verifyToken,hrController.updateJobpostHRViewed)
router.post('/downloadFile',hrController.downloadFileFromChat)
router.patch('/shortListUser',jwtHR.verifyToken,hrController.shortListUser)
router.get('/shortListedUsers/:jobId',jwtHR.verifyToken,hrController.getShortListedUsers)
router.get('/getChat',jwtHR.verifyToken,chatController.getChat)
router.patch('/removeFromShortListed',jwtHR.verifyToken,hrController.removeFromShortListed)


export default router
