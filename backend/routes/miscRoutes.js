import express from "express";
import { getRatings } from "../controllers/ratingController.js";
import { listPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/payments", protect, listPayments);
router.get("/ratings/:userId", protect, getRatings);

export default router;
