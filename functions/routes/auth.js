const express = require("express");
// To properly fix the new-cap warning, use this pattern
// eslint-disable-next-line new-cap
const router = express.Router();
const admin = require("firebase-admin");
const {authenticate} = require("../middleware");

// Register route
router.post("/register", async (req, res) => {
  try {
    const {email, password, firstName, lastName, phone} = req.body;

    // Validate inputs
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Required fields missing",
        message: "Email, password, firstName, and lastName are required",
      });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    await admin
        .firestore()
        .collection("customers")
        .doc(userRecord.uid)
        .set({
          firstName,
          lastName,
          email,
          phone: phone || "",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({error: error.message});
  }
});

// Login route - This is for token validation
// Actual authentication happens client-side with Firebase Auth SDK
router.post("/login", authenticate, async (req, res) => {
  try {
    const uid = req.user.uid;

    // Fetch user details from Firestore
    const userDoc = await admin
        .firestore()
        .collection("customers")
        .doc(uid)
        .get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || "",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({error: error.message});
  }
});

// Get user details
router.get("/user/:uid", authenticate, async (req, res) => {
  try {
    const uid = req.params.uid;

    // Verify the requesting user is authorized to access this data
    if (req.user.uid !== uid && !req.user.admin) {
      return res.status(403).json({error: "Unauthorized access"});
    }

    const userDoc = await admin
        .firestore()
        .collection("customers")
        .doc(uid)
        .get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || "",
      createdAt: userData.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({error: error.message});
  }
});

module.exports = router;
