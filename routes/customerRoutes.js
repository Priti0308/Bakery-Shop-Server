const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const Customer = require('../models/Customer');
const { protectVendor } = require("../middleware/authMiddleware");

// Get all customers for the logged-in vendor
router.get('/', protectVendor, controller.getCustomers);

// Add a customer for the logged-in vendor
router.post('/', protectVendor, controller.addCustomer);

router.put('/:id', protectVendor, controller.updateCustomer);
router.delete('/:id', protectVendor, controller.deleteCustomer);

module.exports = router;
