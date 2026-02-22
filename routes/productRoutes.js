const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

// Public
router.get('/products', productController.showProducts);
router.get('/products/:productId', productController.showProductById);

// Dashboard (protegido)
router.get('/dashboard', authMiddleware, productController.showDashboard);
router.get('/dashboard/new', authMiddleware, productController.showNewProduct);
router.post('/dashboard', authMiddleware, productController.createProduct);

router.get('/dashboard/:productId', authMiddleware, productController.showDashboardProductById);
router.get('/dashboard/:productId/edit', authMiddleware, productController.showEditProduct);
router.put('/dashboard/:productId', authMiddleware, productController.updateProduct);
router.delete('/dashboard/:productId/delete', authMiddleware, productController.deleteProduct);

module.exports = router;