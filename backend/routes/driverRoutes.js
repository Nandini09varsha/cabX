import express from "express";
import { getDriverProfile } from "../controllers/driverController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("driver"), getDriverProfile);

export default router;
