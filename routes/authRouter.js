import express from 'express';
import User from '../models/userModel.js'
import asyncHandler from '../middleware/asyncHandler.js';
import { getUser, loginUser, logoutUser, registerUser } from '../controller/authController.js';
import { protectedMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', protectedMiddleware,logoutUser)
router.get('/getuser', protectedMiddleware, getUser)

export default router