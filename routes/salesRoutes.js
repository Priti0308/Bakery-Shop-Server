const express = require('express');
const router = express.Router();
const controller = require('../controllers/salesController');
const { protectVendor } = require("../middleware/authMiddleware");

router.put('/:id', protectVendor, controller.updateSale);
router.delete('/:id', protectVendor, controller.deleteSale);

router.post('/', protectVendor, controller.recordSale);

router.get('/my', protectVendor, controller.getVendorSales);

module.exports = router;
