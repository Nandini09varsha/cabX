import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { httpError } from "./errorHandler.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

export const requireWallet = (req, res, next) => {
  if (!req.user?.walletAddress) {
    return next(httpError(400, "Link a Solana wallet before continuing"));
  }
  next();
};
