import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const generateToken = (id: string, type: 'access' | 'refresh'): string => {
  const secret = type === 'access' ? process.env.JWT_SECRET! : process.env.JWT_REFRESH_SECRET!
  const expiresIn = type === 'access' ? '15m' : '7d'
  return jwt.sign({ id }, secret, { expiresIn })
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })

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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

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

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({
      _id: user!._id,
      name: user!.name,
      email: user!.email,
      role: user!.role,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
