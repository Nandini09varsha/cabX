import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
// On success, sets req.user = the User document (password excluded).
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

// Optional role gate, e.g. authorizeRoles("rider") or authorizeRoles("driver", "admin").
// Use after `protect` on routes that should only be reachable by certain roles.
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

export { protect, authorizeRoles };
