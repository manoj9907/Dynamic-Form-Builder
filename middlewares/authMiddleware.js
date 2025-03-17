const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.checkAdmin = (req, res, next) => {
  const userRole = req.cookies?.role;
  console.log("userRole", req);
  if (!userRole || userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
