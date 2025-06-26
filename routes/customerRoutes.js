const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const Customer = require('../models/Customer'); 

router.get('/', controller.getCustomers);
router.post('/', controller.addCustomer);

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
