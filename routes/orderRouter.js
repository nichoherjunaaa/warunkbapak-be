import express from 'express';
import { allOrder, createOrder, currentAuthOrder, detailOrder } from '../controller/orderController.js';
import { protectedMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protectedMiddleware, adminMiddleware, createOrder)
router.get('/', protectedMiddleware, adminMiddleware,allOrder)
router.get('/:id', protectedMiddleware, adminMiddleware, detailOrder)
router.get('/current/user', protectedMiddleware, currentAuthOrder)

export default router