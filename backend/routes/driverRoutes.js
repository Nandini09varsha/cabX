import express from "express";
import {
  confirmDriverRegister,
  getDriverMe,
  listDrivers,
  registerDriver,
  updateAvailability,
  voteVerifyDriver,
} from "../controllers/driverController.js";
import { getEarnings } from "../controllers/paymentController.js";
import {
  protect,
  authorizeRoles,
  requireWallet,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listDrivers);
router.post(
  "/:driverId/votes",
  protect,
  authorizeRoles("rider", "driver"),
  voteVerifyDriver,
);

router.use(protect, authorizeRoles("driver"), requireWallet);

router.get("/me", getDriverMe);
router.put("/availability", updateAvailability);
router.post("/register", registerDriver);
router.post("/register/confirm", confirmDriverRegister);
router.get("/earnings", getEarnings);

export default router;
