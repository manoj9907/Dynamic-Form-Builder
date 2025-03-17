const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const createError = require("../utils/errorHandler");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", {
        error: "Validation Error",
        success: null,
      });
    }

    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", {
        error: "Username already taken",
        success: null,
      });
    }

    const user = new User({ username, password, role });
    await user.save();

    res.render("login", {
      success: "Registration successful! Redirecting to login...",
      error: null,
    });
  } catch (err) {
    res.render("login", { error: "Server error", success: null });
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     console.log("d");
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return next(createError(400, "Username and password are required"));
//     }

//     const user = await User.findOne({ username });
//     console.log("user", user);
//     if (!user) {
//       return next(createError(401, "Invalid credentials"));
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return next(createError(401, "Invalid credentials"));
//     }
//     console.log("v");

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ success: true, token });
//   } catch (err) {
//     next(createError(500, "Server error", err.message));
//   }
// };
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("login", {
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirect based on user role
    if (user.role === "admin") {
      return res.redirect("/admin");
    } else {
      return res.redirect("/form");
    }
  } catch (err) {
    res.render("login", { error: "Server error. Please try again." });
  }
};
