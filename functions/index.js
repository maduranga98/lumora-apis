const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const {authenticate} = require("./middleware");
const app = express();

admin.initializeApp();

app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({message: "Hello from Firebase API!"});
});

// Public route
app.post("/users", async (req, res) => {
  try {
    const {name, email} = req.body;
    const user = await admin.firestore().collection("users").add({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({id: user.id, name, email});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Protected route example
app.get("/protected", authenticate, (req, res) => {
  res.json({message: `Hello ${req.user.email}`});
});

exports.api = functions.https.onRequest(app);
