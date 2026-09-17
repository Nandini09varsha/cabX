import express from "express";
import { register, login, getMe, linkWallet } from "../controllers/authController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/wallet", protect, linkWallet);

export default router;
