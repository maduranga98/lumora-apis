const { db, auth } = require("../config/firebase");
const { validationResult } = require("express-validator");

/**
 * Register a new customer
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, phone } = req.body;

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    await db.collection("customers").doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      phone,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Login user - Note: Actual authentication happens client-side with Firebase Auth SDK
 * This endpoint is for validating tokens server-side and returning user data
 */
const login = async (req, res) => {
  try {
    // The user should already be authenticated via the Firebase Auth middleware
    const uid = req.user.uid;

    // Fetch user details from Firestore
    const userDoc = await db.collection("customers").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get user details
 */
const getUserDetails = async (req, res) => {
  try {
    const uid = req.params.uid;

    // Verify the requesting user is authorized to access this data
    if (req.user.uid !== uid && !req.user.admin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const userDoc = await db.collection("customers").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      createdAt: userData.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserDetails,
};
