import express from "express";
import {
  acceptRide,
  cancelRide,
  completeRide,
  confirmAcceptRide,
  confirmCancelRide,
  confirmCompleteRide,
  confirmRideRequest,
  confirmStartRide,
  getCurrentRide,
  getRide,
  listMyRides,
  listOpenRides,
  requestRide,
  startRide,
} from "../controllers/rideController.js";
import { rateRide } from "../controllers/ratingController.js";
import {
  protect,
  authorizeRoles,
  requireWallet,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, requireWallet);

router.get("/open", authorizeRoles("driver", "admin"), listOpenRides);
router.get("/mine", listMyRides);
router.get("/active", getCurrentRide);
router.post("/", authorizeRoles("rider"), requestRide);
router.get("/:id", getRide);
router.post("/:id/confirm", authorizeRoles("rider"), confirmRideRequest);
router.post("/:id/accept", authorizeRoles("driver"), acceptRide);
router.post("/:id/accept/confirm", authorizeRoles("driver"), confirmAcceptRide);
router.post("/:id/start", authorizeRoles("driver"), startRide);
router.post("/:id/start/confirm", authorizeRoles("driver"), confirmStartRide);
router.post("/:id/cancel", authorizeRoles("rider"), cancelRide);
router.post("/:id/cancel/confirm", authorizeRoles("rider"), confirmCancelRide);
router.post("/:id/complete", authorizeRoles("driver"), completeRide);
router.post(
  "/:id/complete/confirm",
  authorizeRoles("driver"),
  confirmCompleteRide,
);
router.post("/:id/rate", authorizeRoles("rider", "driver"), rateRide);

export default router;
