const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// You'll need to generate a service account key from Firebase console
// and save the JSON file, then set the path in your .env file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
