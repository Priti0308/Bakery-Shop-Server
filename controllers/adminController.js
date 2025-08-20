const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return a consistent structure
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = { loginAdmin };
