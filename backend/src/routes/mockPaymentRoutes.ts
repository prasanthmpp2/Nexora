import express from 'express'
import { processMockPayment } from '../controllers/mockPaymentController'
import { protect } from '../middleware/auth'

const router = express.Router()

router.post('/process', protect, processMockPayment)

export default router
