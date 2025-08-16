const express = require("express");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const router = express.Router();
const { loginVendor } = require("../controllers/vendorController");
router.post("/login", loginVendor);


router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add New Vendor
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);
    const { name, businessName, mobile, email, address, password } = req.body;
    // Check for missing fields
    if (!name || !businessName || !mobile || !email || !address || !password) {
      return res.status(400).json({ message: "All fields (name, businessName, mobile, email, address, password) are required." });
    }
    // Check for duplicate mobile
    const existingMobile = await Vendor.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ message: "A vendor with this mobile already exists." });
    }
    // Check for duplicate email
    const existingEmail = await Vendor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "A vendor with this email already exists." });
    }
    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Password hashing error:", err);
      return res.status(500).json({ message: "Password hashing failed" });
    }
    // Save vendor
    const vendor = new Vendor({
      name,
      businessName,
      mobile,
      email,
      address,
      password: hashedPassword,
    });
    await vendor.save();
    console.log("Vendor added successfully:", vendor);
    return res.status(201).json({
      message: "Vendor added successfully!",
      vendor,
    });
  } catch (error) {
    console.error("Error adding vendor:", error);
    
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists." });
      }
      if (error.keyPattern?.mobile) {
        return res.status(400).json({ message: "Mobile already exists." });
      }
      return res.status(400).json({ message: "Duplicate key error." });
    }
    return res.status(500).json({ message: "Failed to add vendor", error: error.message });
  }
});

//  Delete Vendor
router.delete("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve / Reject Vendor
router.put("/:id", async (req, res) => {
  try {
    const { name, businessName, mobile, email,  address, status } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (name) vendor.name = name;
    if (businessName) vendor.businessName = businessName;
    if (mobile) vendor.mobile = mobile;
    if (email) vendor.email = email;
    if (address) vendor.address = address;
    if (status) vendor.status = status;

    await vendor.save();
    res.json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update vendor" });
  }
});

// Change Password
router.put("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.password = await bcrypt.hash(password, 10);
    await vendor.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password" });
  }
});

module.exports = router;
