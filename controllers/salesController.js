// Update a sale for the logged-in vendor
exports.updateSale = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const sale = await Sale.findOne({ _id: req.params.id, vendor: vendorId });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found or not authorized' });
    }
    Object.assign(sale, req.body);
    const updated = await sale.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a sale for the logged-in vendor
exports.deleteSale = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const sale = await Sale.findOneAndDelete({ _id: req.params.id, vendor: vendorId });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found or not authorized' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get all sales for the logged-in vendor

exports.getVendorSales = async (req, res) => {
  try {
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    const sales = await Sale.find({ vendor: vendorId }).populate('customer').populate('items.product');
    res.json(sales);
  } catch (err) {
    console.error('Error in getVendorSales:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.recordSale = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();
  
  try {
    const { customer, items } = req.body;
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
      return res.status(401).json({ message: 'Unauthorized: Vendor not found in request.' });
    }
    if (!customer) {
      return res.status(400).json({ message: 'Customer is required.' });
    }
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for product ${product?.name}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product?.name}` });
      }
      totalAmount += product.price * item.quantity;
    }
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } }).session(session);
      }
    }
    const sale = new Sale({ vendor: vendorId, customer, items, totalAmount });
    const savedSale = await sale.save({ session });
    await session.commitTransaction();
    res.status(201).json(savedSale);
  } catch (err) {
    await session.abortTransaction();
    console.error('Error in recordSale:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};
