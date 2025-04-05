// Don't initialize admin here, just import it
const admin = require("firebase-admin");

// Export the authenticate middleware
const authenticate = async (req, res, next) => {
  try {
    // First check if the authorization header exists
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({error: "No token provided"});
    }

    // Now it's safe to split
    const token = req.headers.authorization.split("Bearer ")[1];

    // Check if token exists after split
    if (!token) {
      return res.status(401).json({error: "No token provided"});
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({error: "Invalid token"});
  }
};

module.exports = {authenticate};
