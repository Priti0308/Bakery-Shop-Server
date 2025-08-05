const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginVendor = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ mobile });
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: "vendor", mobile: vendor.mobile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginVendor };
