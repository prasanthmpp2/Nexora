import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { sendEmail } from '../utils/emailService'
import crypto from 'crypto'

// Generate JWT Token
const generateToken = (id: string, type: 'access' | 'refresh'): string => {
  const secret =
    type === 'access'
      ? process.env.JWT_SECRET!
      : process.env.JWT_REFRESH_SECRET!

  const expiresIn = type === 'access' ? '15m' : '7d'

  return jwt.sign({ id }, secret, { expiresIn })
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      const accessToken = generateToken(user._id.toString(), 'access')
      const refreshToken = generateToken(user._id.toString(), 'refresh')

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = generateToken(user._id.toString(), 'access')
    const refreshToken = generateToken(user._id.toString(), 'refresh')

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string }

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const accessToken = generateToken(user._id.toString(), 'access')

    res.json({ accessToken })
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired refresh token' })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      _id: user!._id,
      name: user!.name,
      email: user!.email,
      role: user!.role,
      avatar: user!.avatar,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    await user.save()

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>You requested a password reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    })

    res.json({ message: 'Password reset email sent' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
