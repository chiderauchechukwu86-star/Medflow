const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { normalizeRole } = require("../config/roles");

// Verifies JWT and attaches the user to req.user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Not authorized, user not found or inactive" });
    }

    // Normalize in-memory so every authorize() check downstream — and every
    // response built from req.user — sees the same canonical role that
    // toSafeObject() would produce. Without this, a stale document could
    // pass the isActive check above but then silently fail every authorize()
    // gate because req.user.role held an unrecognized legacy value.
    user.role = normalizeRole(user.role);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

// Restricts access to specific roles, e.g. authorize("admin", "doctor")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorize };
