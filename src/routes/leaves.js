const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getStaffLeaves,
  createLeave,
  updateLeaveStatus,
} = require("../controllers/leavesController");
const { verifyToken } = require("../middleware/auth");

// Get all leaves for a staff member - GET /api/leaves/staff/:staffId
router.get("/staff/:staffId", verifyToken, getStaffLeaves);

// Create a new leave - POST /api/leaves
router.post(
  "/",
  [
    verifyToken,
    body("staffId").notEmpty().withMessage("Staff ID is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
  ],
  createLeave
);

// Update a leave status - PATCH /api/leaves/staff/:staffId/leave/:leaveId
router.patch("/staff/:staffId/leave/:leaveId", verifyToken, updateLeaveStatus);

module.exports = router;
