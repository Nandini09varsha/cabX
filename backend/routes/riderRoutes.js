import express from "express";
import { getProfile, updateProfile } from "../controllers/riderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("rider"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
