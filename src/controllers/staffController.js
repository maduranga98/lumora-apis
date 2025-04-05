const { db } = require("../config/firebase");

/**
 * Get all staff members for a specific salon
 */
const getStaffBySalon = async (req, res) => {
  try {
    const salonId = req.params.salonId;

    const staffSnapshot = await db
      .collection("users")
      .where("salonId", "==", salonId)
      .where("role", "==", "staff")
      .get();

    if (staffSnapshot.empty) {
      return res.status(200).json([]);
    }

    const staffMembers = [];
    staffSnapshot.forEach((doc) => {
      const staffData = doc.data();
      // Filter out sensitive information
      staffMembers.push({
        id: doc.id,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        phone: staffData.phone,
        specialization: staffData.specialization,
        imageUrl: staffData.imageUrl,
        bio: staffData.bio,
      });
    });

    return res.status(200).json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff members:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get staff member by ID
 */
const getStaffById = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const staffDoc = await db.collection("users").doc(staffId).get();

    if (!staffDoc.exists) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    const staffData = staffDoc.data();

    // Check if the document is actually a staff member
    if (staffData.role !== "staff") {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Filter out sensitive information
    return res.status(200).json({
      id: staffDoc.id,
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      email: staffData.email,
      phone: staffData.phone,
      specialization: staffData.specialization,
      imageUrl: staffData.imageUrl,
      bio: staffData.bio,
      salonId: staffData.salonId,
    });
  } catch (error) {
    console.error("Error fetching staff member:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStaffBySalon,
  getStaffById,
};
