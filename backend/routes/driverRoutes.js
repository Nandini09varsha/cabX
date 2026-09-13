import express from "express";
import {
  getDriverProfile,
  getRideRequests,
  acceptRide,
  rejectRide,
  getCurrentRide,
  startRide,
  completeRide,
  getRideHistory,
  getDriverEarnings,
} from "../controllers/driverController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("driver"), getDriverProfile);
router.get("/requests", protect, authorizeRoles("driver"), getRideRequests);
router.patch(
  "/rides/:rideId/accept",
  protect,
  authorizeRoles("driver"),
  acceptRide,
);

router.patch(
  "/rides/:rideId/reject",
  protect,
  authorizeRoles("driver"),
  rejectRide,
);

router.get("/current-ride", protect, authorizeRoles("driver"), getCurrentRide);

router.patch(
  "/rides/:rideId/start",
  protect,
  authorizeRoles("driver"),
  startRide,
);

router.patch(
  "/rides/:rideId/complete",
  protect,
  authorizeRoles("driver"),
  completeRide,
);

router.get("/rides/history", protect, authorizeRoles("driver"), getRideHistory);

router.get("/earnings", protect, authorizeRoles("driver"), getDriverEarnings);

export default router;
