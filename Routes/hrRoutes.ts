import express from 'express'
const router = express.Router()
import hrController from '../Controller/hrController'
router.post('/signup_submit',hrController.hrSignup)

export default router
