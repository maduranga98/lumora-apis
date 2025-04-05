const { db } = require("../config/firebase");
const { validationResult } = require("express-validator");

/**
 * Get all leaves for a staff member
 */
const getStaffLeaves = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const leavesSnapshot = await db
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
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new leave
 */
const createLeave = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { staffId, startDate, endDate, reason } = req.body;

    // Check if staff member exists
    const staffDoc = await db.collection("users").doc(staffId).get();
    if (!staffDoc.exists) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Check if the staff member has role=staff
    const staffData = staffDoc.data();
    if (staffData.role !== "staff") {
      return res.status(400).json({ error: "User is not a staff member" });
    }

    // Check for overlapping leaves
    const overlappingSnapshot = await db
      .collection("users")
      .doc(staffId)
      .collection("leaves")
      .where("startDate", "<=", endDate)
      .where("endDate", ">=", startDate)
      .get();

    if (!overlappingSnapshot.empty) {
      return res
        .status(409)
        .json({ error: "Leave period overlaps with an existing leave" });
    }

    // Create the leave
    const leaveRef = db
      .collection("users")
      .doc(staffId)
      .collection("leaves")
      .doc();
    const leaveData = {
      startDate,
      endDate,
      reason: reason || "",
      status: "pending", // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };

    await leaveRef.set(leaveData);

    return res.status(201).json({
      id: leaveRef.id,
      ...leaveData,
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update a leave status
 */
const updateLeaveStatus = async (req, res) => {
  try {
    const { staffId, leaveId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be pending, approved, or rejected",
      });
    }

    const leaveRef = db
      .collection("users")
      .doc(staffId)
      .collection("leaves")
      .doc(leaveId);
    const leaveDoc = await leaveRef.get();

    if (!leaveDoc.exists) {
      return res.status(404).json({ error: "Leave not found" });
    }

    // Update the leave status
    await leaveRef.update({ status });

    return res
      .status(200)
      .json({ message: "Leave status updated successfully" });
  } catch (error) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStaffLeaves,
  createLeave,
  updateLeaveStatus,
};
