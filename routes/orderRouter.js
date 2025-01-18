import express from 'express';
import { allOrder, callbackPayment, createOrder, currentAuthOrder, detailOrder } from '../controller/orderController.js';
import { protectedMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protectedMiddleware, createOrder)
router.get('/', protectedMiddleware, adminMiddleware,allOrder)
router.get('/:id', protectedMiddleware, adminMiddleware, detailOrder)
router.get('/current/user', protectedMiddleware, currentAuthOrder)
router.post('/callback/midtrans', (req, res) => res.send('jalan'))

export default router