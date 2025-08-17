const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const { protectVendor } = require("../middleware/authMiddleware");

router.get('/daily', protectVendor, controller.getDailyReport);
router.get('/monthly', protectVendor, controller.getMonthlyReport);

module.exports = router;
