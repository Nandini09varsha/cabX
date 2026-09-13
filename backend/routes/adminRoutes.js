import express from "express";
import {
  confirmSlashDriver,
  confirmVerifyDriver,
  initializeAdmin,
  slashDriver,
  verifyDriver,
} from "../controllers/adminController.js";
import { protect, authorizeRoles, requireWallet } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"), requireWallet);

router.post("/initialize", initializeAdmin);
router.post("/drivers/:driverId/verify", verifyDriver);
router.post("/drivers/:driverId/verify/confirm", confirmVerifyDriver);
router.post("/drivers/:driverId/slash", slashDriver);
router.post("/drivers/:driverId/slash/confirm", confirmSlashDriver);

export default router;
