const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {authenticate} = require("./middleware");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express app - use lowercase variable name to avoid ESLint warnings
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Basic route
app.get("/hello", (req, res) => {
  res.json({message: "Hello from Firebase API!"});
});

// Public route - Register a new user
app.post("/users", async (req, res) => {
  try {
    const {name, email} = req.body;

    if (!name || !email) {
      return res.status(400).json({error: "Name and email are required"});
    }

    const user = await admin.firestore().collection("users").add({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({id: user.id, name, email});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({error: error.message});
  }
});

// Protected route example
app.get("/protected", authenticate, (req, res) => {
  res.json({message: `Hello ${req.user.email}`});
});

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Services routes
const servicesRoutes = require("./routes/services");
app.use("/services", servicesRoutes);

// Staff routes
const staffRoutes = require("./routes/staff");
app.use("/staff", staffRoutes);

// Booking routes
const bookingRoutes = require("./routes/booking");
app.use("/booking", bookingRoutes);

// Leaves routes
const leavesRoutes = require("./routes/leaves");
app.use("/leaves", leavesRoutes);

// Export the Express API as a Cloud Function
exports.api = functions.https.onRequest(app);
