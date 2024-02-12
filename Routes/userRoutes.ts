import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'
import jwt from '../Middleware/jwt'

router.post('/signup_submit',userController.signupSubmit)
router.post('/verifyOtp',userController.verifyOtp)
router.post('/login_submit',userController.loginSubmit)
router.get('/getUser/:userId',userController.getUser)
router.post('/update',userController.updateUser)







router.get('/sample',jwt.verifyToken,userController.loginSubmit)



export default router