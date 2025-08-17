// Update a customer for the logged-in vendor
exports.updateCustomer = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const customer = await Customer.findOne({ _id: req.params.id, vendor: vendorId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or not authorized' });
    }
    Object.assign(customer, req.body);
    const updated = await customer.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a customer for the logged-in vendor
exports.deleteCustomer = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, vendor: vendorId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or not authorized' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const Customer = require('../models/Customer');
const mongoose = require('mongoose');


// Get all customers for the logged-in vendor
exports.getCustomers = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const customers = await Customer.find({ vendor: vendorId });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a customer for the logged-in vendor
exports.addCustomer = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const customer = new Customer({ ...req.body, vendor: vendorId });
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
