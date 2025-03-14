const express = require("express");
const { register, login } = require("../controller/authController");
const { body } = require("express-validator");

const router = express.Router();

const validateUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.post("/register", validateUser, register);
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});
router.post("/login", login);

module.exports = router;
