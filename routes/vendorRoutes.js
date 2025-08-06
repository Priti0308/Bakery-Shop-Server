const express = require("express");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const router = express.Router();
const { loginVendor } = require("../controllers/vendorController");
router.post("/login", loginVendor);

// ✅ Get All Vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add New Vendor
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const { name, businessName, mobile, address, password } = req.body;

    if (!name || !businessName || !mobile || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ mobile });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
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
      address,
      password: hashedPassword,
      status: "pending"
    });

    await vendor.save();
    console.log("Vendor added successfully:", vendor);

    return res.status(201).json(vendor);
  } catch (error) {
    console.error("Error adding vendor:", error);
    return res.status(500).json({ message: "Failed to add vendor", error: error.message });
  }
});


// ✅ Approve / Reject Vendor
router.put("/:id", async (req, res) => {
  try {
    const { name, businessName, mobile, address, status } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (name) vendor.name = name;
    if (businessName) vendor.businessName = businessName;
    if (mobile) vendor.mobile = mobile;
    if (address) vendor.address = address;
    if (status) vendor.status = status;

    await vendor.save();
    res.json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update vendor" });
  }
});

// ✅ Change Password
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
