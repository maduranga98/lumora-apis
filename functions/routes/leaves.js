const express = require("express");
// Use lowercase for router to avoid new-cap warning
const router = express.Router();
const admin = require("firebase-admin");
const {authenticate} = require("../middleware");

// Get all leaves for a staff member
router.get("/staff/:staffId", authenticate, async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const leavesSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .collection("leaves")
        .orderBy("startDate", "asc")
        .get();

    if (leavesSnapshot.empty) {
      return res.status(200).json([]);
    }

    const leaves = [];
    leavesSnapshot.forEach((doc) => {
      leaves.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({error: error.message});
  }
});

// Create a new leave
router.post("/", authenticate, async (req, res) => {
  try {
    const {staffId, startDate, endDate, reason} = req.body;

    // Validation
    if (!staffId || !startDate || !endDate) {
      return res.status(400).json({
        error: "Required fields missing",
        message: "staffId, startDate, and endDate are required",
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

    // Check if the staff member has role=staff
    const staffData = staffDoc.data();
    if (staffData.role !== "staff") {
      return res.status(400).json({error: "User is not a staff member"});
    }

    // Check for overlapping leaves
    const overlappingSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .collection("leaves")
        .where("startDate", "<=", endDate)
        .where("endDate", ">=", startDate)
        .get();

    if (!overlappingSnapshot.empty) {
      return res.status(409).json({
        error: "Leave period overlaps with an existing leave",
      });
    }

    // Create the leave
    const leaveRef = admin
        .firestore()
        .collection("users")
        .doc(staffId)
        .collection("leaves")
        .doc();

    const leaveData = {
      startDate,
      endDate,
      reason: reason || "",
      status: "pending", // pending, approved, rejected
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await leaveRef.set(leaveData);

    return res.status(201).json({
      id: leaveRef.id,
      ...leaveData,
      createdAt: new Date().toISOString(), // Convert timestamp to ISO string
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    return res.status(500).json({error: error.message});
  }
});

// Update a leave status
router.patch(
    "/staff/:staffId/leave/:leaveId",
    authenticate,
    async (req, res) => {
      try {
        const {staffId, leaveId} = req.params;
        const {status} = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
          return res.status(400).json({
            error: "Invalid status. Must be pending, approved, or rejected",
          });
        }

        const leaveRef = admin
            .firestore()
            .collection("users")
            .doc(staffId)
            .collection("leaves")
            .doc(leaveId);

        const leaveDoc = await leaveRef.get();

        if (!leaveDoc.exists) {
          return res.status(404).json({error: "Leave not found"});
        }

        // Update the leave status
        await leaveRef.update({status});

        return res
            .status(200)
            .json({message: "Leave status updated successfully"});
      } catch (error) {
        console.error("Error updating leave status:", error);
        return res.status(500).json({error: error.message});
      }
    },
);

module.exports = router;
