import express from 'express';
import { protectedMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { allProducts, createProduct, deleteProduct, detailProduct, updateProduct, uploadDataProduct } from '../controller/productController.js';
import { upload } from '../utils/uploadFileHandler.js';
const router = express.Router();

router.post('/create', protectedMiddleware, adminMiddleware, createProduct)
router.post('/upload', protectedMiddleware, adminMiddleware, upload.single('image'), uploadDataProduct)
router.get('/detail/:id', detailProduct)
router.get('/products', allProducts);
router.put('/update/:id', protectedMiddleware, adminMiddleware, updateProduct)
router.delete('/delete/:id', protectedMiddleware, adminMiddleware, deleteProduct)

export default router