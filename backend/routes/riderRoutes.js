import express from "express";
import { getProfile, updateProfile } from "../controllers/riderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires a valid token AND role === "rider".
router.use(protect, authorizeRoles("rider"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
