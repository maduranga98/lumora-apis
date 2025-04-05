const { auth } = require("../config/firebase");

/**
 * Middleware to verify the Firebase ID token
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = {
  verifyToken,
};
