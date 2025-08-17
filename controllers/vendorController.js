const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor"); // adjust path

const loginVendor = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ mobile });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
  token,
  vendor: {
    id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    businessName: vendor.businessName,
    address: vendor.address,
    mobile: vendor.mobile,
    status: vendor.status, 
  },
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get logged in vendor profile
// @route GET /api/vendors/me
// @access Private
const getVendorProfile = async (req, res) => {
  try {
    if (!req.vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(req.vendor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { loginVendor, getVendorProfile };
