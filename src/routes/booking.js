const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getStaffBookings,
  createBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/auth");

// Get all bookings for a staff member - GET /api/booking/staff/:staffId
router.get("/staff/:staffId", verifyToken, getStaffBookings);

// Create a new booking - POST /api/booking
router.post(
  "/",
  [
    verifyToken,
    body("staffId").notEmpty().withMessage("Staff ID is required"),
    body("customerId").notEmpty().withMessage("Customer ID is required"),
    body("serviceId").notEmpty().withMessage("Service ID is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
  ],
  createBooking
);

// Update a booking status - PATCH /api/booking/staff/:staffId/booking/:bookingId
router.patch(
  "/staff/:staffId/booking/:bookingId",
  verifyToken,
  updateBookingStatus
);

module.exports = router;
