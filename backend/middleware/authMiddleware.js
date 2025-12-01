// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // support different payload shapes: { id }, { userId }, { _id }
    const userId = decoded.id || decoded.userId || decoded._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Invalid token payload: no user id" });
    }

    req.userId = userId; // ✅ used by Task routes
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
