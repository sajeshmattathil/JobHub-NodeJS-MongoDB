import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'
import jwt from '../Middleware/jwt'

router.post('/signup_submit',userController.signupSubmit)
router.post('/login_submit',userController.loginSubmit)
router.get('/sample',jwt.verifyToken,userController.loginSubmit)



export default router