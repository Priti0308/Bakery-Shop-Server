const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController.js');
const { protectVendor } = require("../middleware/authMiddleware");

router.get('/', protectVendor, controller.getProducts);
router.post('/', protectVendor, controller.addProduct);
router.get('/barcode/:barcode', controller.getProductByBarcode);
router.put('/:id/stock', controller.updateStock);
router.put('/:id/stockin', controller.stockIn);
router.put('/:id/stockout', controller.stockOut);
router.put('/:id', protectVendor, controller.updateProduct);
router.delete('/:id', protectVendor, controller.deleteProduct);

module.exports = router;
