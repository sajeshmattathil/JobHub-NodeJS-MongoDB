import express from 'express'
const router = express.Router()
import userController from '../Controller/userController'

router.post('/signup_submit',userController.signupSubmit)

export default router