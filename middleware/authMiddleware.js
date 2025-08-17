import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export const protectVendor = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get vendor from DB except password
      req.vendor = await Vendor.findById(decoded.id).select("-password");

      if (!req.vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
