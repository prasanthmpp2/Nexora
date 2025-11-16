import express from 'express'
import { processMockPayment, simulateFailedPayment } from '../controllers/mockPaymentController'
import { protect } from '../middleware/auth'

const router = express.Router()

// Simple one-click payment
router.post('/process', protect, processMockPayment)

// Optional: Test failure scenario
router.post('/fail', protect, simulateFailedPayment)

export default router
