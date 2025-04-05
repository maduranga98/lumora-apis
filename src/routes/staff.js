const express = require("express");
const router = express.Router();
const {
  getStaffBySalon,
  getStaffById,
} = require("../controllers/staffController");

// Get all staff for a salon - GET /api/staff/salon/:salonId
router.get("/salon/:salonId", getStaffBySalon);

// Get staff member by ID - GET /api/staff/:staffId
router.get("/:staffId", getStaffById);

module.exports = router;
