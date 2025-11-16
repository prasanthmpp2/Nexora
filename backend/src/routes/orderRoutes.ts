import express from 'express'
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { protect, admin } from '../middleware/auth'

const router = express.Router()

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders)
router.get('/myorders', protect, getMyOrders)
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus)

export default router
