const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  register,
  login,
  getUserDetails,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Register route - POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ],
  register
);

// Login route - POST /api/auth/login
// Note: This is for token validation, actual login happens client-side
router.post("/login", verifyToken, login);

// Get user details - GET /api/auth/user/:uid
router.get("/user/:uid", verifyToken, getUserDetails);

module.exports = router;
