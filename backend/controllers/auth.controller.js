import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/user.model.js'
import { generateTokenAndSetCookie } from '../utils/jwt.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const signup = async (req, res) => {
    const { email, username, password } = req.body
    try {
        if (!email || !username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, email, password: hashedPassword })
        await user.save()
        generateTokenAndSetCookie(res, user._id)
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { ...user._doc, password: undefined },
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Error in signup', error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }
        const user = await User.findOne({ email })
        if (!user || !user.password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }
        generateTokenAndSetCookie(res, user._id)
        res.json({ success: true, user: { ...user._doc, password: undefined } })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })
        res.json({ success: true, user })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}

export const logout = async (_req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
        res.json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const googleOAuth = async (req, res) => {
    try {
        const { id_token } = req.body
        if (!id_token) return res.status(400).json({ success: false, message: 'Missing id_token' })

        const ticket = await googleClient.verifyIdToken({ idToken: id_token, audience: process.env.VITE_GOOGLE_CLIENT_ID })
        const payload = ticket.getPayload()
        const googleId = payload.sub
        const email = payload.email
        const picture = payload.picture
        const name = payload.name

        let user = await User.findOne({ email })
        if (!user) {
            user = new User({ username: name, email, googleId, picture })
            await user.save()
        } else if (!user.googleId || user.picture !== picture) {
            user.googleId = user.googleId || googleId
            user.picture = picture
            user.username = user.username || name
            await user.save()
        }

        generateTokenAndSetCookie(res, user._id)
        res.json({ success: true, user: { ...user._doc, password: undefined } })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Google authentication failed', error: error.message })
    }
}