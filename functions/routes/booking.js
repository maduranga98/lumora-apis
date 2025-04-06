const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const admin = require("firebase-admin");
const {authenticate} = require("../middleware");

// Get all bookings for a staff member
router.get("/staff/:staffId", authenticate, async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const bookingsSnapshot = await admin
        .firestore()
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
    return res.status(500).json({error: error.message});
  }
});

// Create a new booking
router.post("/", authenticate, async (req, res) => {
  try {
    const {staffId, customerId, serviceId, date, startTime, endTime, notes} =
      req.body;

    // Validation
    if (
      !staffId ||
      !customerId ||
      !serviceId ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        error: "Required fields missing",
        message:
          "staffId, customerId, serviceId, date, startTime, and endTime " +
          "are required",
      });
    }

    // Check if staff member exists
    const staffDoc = await admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .get();
    if (!staffDoc.exists) {
      return res.status(404).json({error: "Staff member not found"});
    }

    // Check if customer exists
    const customerDoc = await admin
        .firestore()
        .collection("customers")
        .doc(customerId)
        .get();
    if (!customerDoc.exists) {
      return res.status(404).json({error: "Customer not found"});
    }

    // Check for booking conflicts
    const conflictSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .collection("bookings")
        .where("date", "==", date)
        .where("startTime", "<", endTime)
        .where("endTime", ">", startTime)
        .get();

    if (!conflictSnapshot.empty) {
      return res.status(409).json({
        error: "Booking time conflicts with an existing booking",
      });
    }

    // Create the booking
    const bookingRef = admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .collection("bookings")
        .doc();

    // Get customer first and last name for better readability in long lines
    const firstName = customerDoc.data().firstName;
    const lastName = customerDoc.data().lastName;

    const bookingData = {
      customerId,
      customerName: `${firstName} ${lastName}`,
      serviceId,
      date,
      startTime,
      endTime,
      status: "confirmed",
      notes: notes || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await bookingRef.set(bookingData);

    // Also save the booking in the customer's bookings collection
    // Split long line to avoid max-len error
    const customerBookingRef = admin
        .firestore()
        .collection("customers")
        .doc(customerId)
        .collection("bookings")
        .doc(bookingRef.id);

    // Get staff first and last name to avoid long line
    const staffFirstName = staffDoc.data().firstName;
    const staffLastName = staffDoc.data().lastName;

    await customerBookingRef.set({
      ...bookingData,
      staffId,
      staffName: `${staffFirstName} ${staffLastName}`,
    });

    return res.status(201).json({
      id: bookingRef.id,
      ...bookingData,
      createdAt: new Date().toISOString(), // Convert timestamp to ISO string
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({error: error.message});
  }
});

// Update a booking status
router.patch(
    "/staff/:staffId/booking/:bookingId",
    authenticate,
    async (req, res) => {
      try {
        const {staffId, bookingId} = req.params;
        const {status} = req.body;

        if (!["confirmed", "cancelled", "completed"].includes(status)) {
          return res.status(400).json({
            error: "Invalid status. Must be confirmed, cancelled, or completed",
          });
        }

        const bookingRef = admin
            .firestore()
            .collection("users")
            .doc(staffId)
            .collection("bookings")
            .doc(bookingId);

        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
          return res.status(404).json({error: "Booking not found"});
        }

        const bookingData = bookingDoc.data();

        // Update the booking status
        await bookingRef.update({status});

        // Update the status in the customer's bookings collection as well
        // Split long line to avoid max-len error
        const customerBookingRef = admin
            .firestore()
            .collection("customers")
            .doc(bookingData.customerId)
            .collection("bookings")
            .doc(bookingId);

        await customerBookingRef.update({status});

        return res
            .status(200)
            .json({message: "Booking status updated successfully"});
      } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({error: error.message});
      }
    },
);

module.exports = router;
