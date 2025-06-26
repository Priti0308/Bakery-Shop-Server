const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const Customer = require('../models/Customer');

router.get('/', controller.getCustomers);

router.post('/', controller.addCustomer);

router.put('/:id', async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, address, contact },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
