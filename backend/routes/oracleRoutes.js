import express from "express";
import {
  getMyLocation,
  getRideTracking,
  listNearbyDrivers,
  reportLocation,
} from "../controllers/oracleController.js";
import {
  protect,
  authorizeRoles,
  requireWallet,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", protect, listNearbyDrivers);
router.get("/rides/:id/tracking", protect, requireWallet, getRideTracking);
router.post(
  "/location",
  protect,
  authorizeRoles("driver"),
  requireWallet,
  reportLocation,
);
router.get(
  "/location/me",
  protect,
  authorizeRoles("driver"),
  requireWallet,
  getMyLocation,
);

export default router;
