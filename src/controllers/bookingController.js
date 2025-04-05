const { db } = require("../config/firebase");
const { validationResult } = require("express-validator");

/**
 * Get all bookings for a staff member
 */
const getStaffBookings = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const bookingsSnapshot = await db
      .collection("users")
      .doc(staffId)
      .collection("bookings")
      .orderBy("date", "asc")
      .get();

    if (bookingsSnapshot.empty) {
      return res.status(200).json([]);
    }

    const bookings = [];
    bookingsSnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new booking
 */
const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { staffId, customerId, serviceId, date, startTime, endTime, notes } =
      req.body;

    // Check if staff member exists
    const staffDoc = await db.collection("users").doc(staffId).get();
    if (!staffDoc.exists) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Check if customer exists
    const customerDoc = await db.collection("customers").doc(customerId).get();
    if (!customerDoc.exists) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check for booking conflicts
    const conflictSnapshot = await db
      .collection("users")
      .doc(staffId)
      .collection("bookings")
      .where("date", "==", date)
      .where("startTime", "<", endTime)
      .where("endTime", ">", startTime)
      .get();

    if (!conflictSnapshot.empty) {
      return res
        .status(409)
        .json({ error: "Booking time conflicts with an existing booking" });
    }

    // Create the booking
    const bookingRef = db
      .collection("users")
      .doc(staffId)
      .collection("bookings")
      .doc();
    const bookingData = {
      customerId,
      customerName: `${customerDoc.data().firstName} ${
        customerDoc.data().lastName
      }`,
      serviceId,
      date,
      startTime,
      endTime,
      status: "confirmed",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    await bookingRef.set(bookingData);

    // Also save the booking in the customer's bookings collection
    await db
      .collection("customers")
      .doc(customerId)
      .collection("bookings")
      .doc(bookingRef.id)
      .set({
        ...bookingData,
        staffId,
        staffName: `${staffDoc.data().firstName} ${staffDoc.data().lastName}`,
      });

    return res.status(201).json({
      id: bookingRef.id,
      ...bookingData,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update a booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { staffId, bookingId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be confirmed, cancelled, or completed",
      });
    }

    const bookingRef = db
      .collection("users")
      .doc(staffId)
      .collection("bookings")
      .doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const bookingData = bookingDoc.data();

    // Update the booking status
    await bookingRef.update({ status });

    // Update the status in the customer's bookings collection as well
    await db
      .collection("customers")
      .doc(bookingData.customerId)
      .collection("bookings")
      .doc(bookingId)
      .update({ status });

    return res
      .status(200)
      .json({ message: "Booking status updated successfully" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStaffBookings,
  createBooking,
  updateBookingStatus,
};
