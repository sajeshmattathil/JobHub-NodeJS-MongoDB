import express from 'express'
const router = express.Router()
import hrController from '../Controller/hrController'

router.post('/signup_submit',hrController.hrSignup)
router.post('/verifyOtp',hrController.verifyOtp)
router.post('/login_submit',hrController.hrLogin)
router.post('/createJOb',hrController.createJOb)
router.get('/getJobs/:id',hrController.getJobs)
router.get('/getHR/:id',hrController.getHR)
router.post('/update/:id',hrController.updateProfile)
router.get('/getJobDetails/:id',hrController.getJobDetails)
router.delete('/deleteJob/:id',hrController.deleteJob)updateJobpost
router.post('/updateJob',hrController.updateJob)
router.patch('/updateJobpostHRViewed/:id',hrController.updateJobpostHRViewed)


export default router
