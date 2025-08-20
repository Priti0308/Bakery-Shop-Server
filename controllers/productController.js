const Product = require("../models/Product");
const mongoose = require("mongoose");

// Get all products for the logged-in vendor
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.vendor._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a new product for the logged-in vendor
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      quantity,
      price,
      barcode,
      weight,
      expiryDate,
      manufacturingDate,
    } = req.body;
    const vendorId = req.vendor._id;

    if (
      !name ||
      !quantity ||
      !price ||
      !weight ||
      !expiryDate ||
      !manufacturingDate
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const product = new Product({
      name,
      quantity,
      price,
      barcode,
      weight,
      expiryDate,
      manufacturingDate,
      vendor: req.vendor._id,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get product by barcode (no vendor check for barcode scan)
exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product stock (for vendor)
exports.updateStock = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      { $set: req.body },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Stock update failed", error: err.message });
  }
};

// Stock in (increase quantity)
exports.stockIn = async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      { $inc: { quantity: amount } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Stock in failed", error: err.message });
  }
};

// Stock out (decrease quantity)
exports.stockOut = async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      { $inc: { quantity: -amount } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Stock out failed", error: err.message });
  }
};

// Update product details
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product update failed", error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.vendor._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Product deletion failed", error: err.message });
  }
};
