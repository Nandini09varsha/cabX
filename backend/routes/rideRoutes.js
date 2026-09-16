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

router.use(protect);

router.get("/open", authorizeRoles("driver", "admin"), listOpenRides);
router.get("/mine", listMyRides);
router.get("/active", getCurrentRide);
router.get("/:id", getRide);
router.post("/:id/rate", authorizeRoles("rider", "driver"), rateRide);

router.post("/", authorizeRoles("rider"), requireWallet, requestRide);
router.post("/:id/confirm", authorizeRoles("rider"), requireWallet, confirmRideRequest);
router.post("/:id/accept", authorizeRoles("driver"), requireWallet, acceptRide);
router.post("/:id/accept/confirm", authorizeRoles("driver"), requireWallet, confirmAcceptRide);
router.post("/:id/start", authorizeRoles("driver"), requireWallet, startRide);
router.post("/:id/start/confirm", authorizeRoles("driver"), requireWallet, confirmStartRide);
router.post("/:id/cancel", authorizeRoles("rider"), requireWallet, cancelRide);
router.post("/:id/cancel/confirm", authorizeRoles("rider"), requireWallet, confirmCancelRide);
router.post("/:id/complete", authorizeRoles("driver"), requireWallet, completeRide);
router.post(
  "/:id/complete/confirm",
  authorizeRoles("driver"),
  requireWallet,
  confirmCompleteRide,
);

export default router;
