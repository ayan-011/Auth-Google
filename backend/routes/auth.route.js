import express from 'express'
import { signup, login, logout, me, googleOAuth } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', verifyToken, me)
router.post('/google', googleOAuth)

export default router