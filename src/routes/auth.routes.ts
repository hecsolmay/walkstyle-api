import * as authController from '@/controllers/auth.controller'
import { Router } from 'express'

const router = Router()
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/refresh-token', authController.refreshToken)

export default router
