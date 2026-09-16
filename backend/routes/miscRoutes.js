import express from "express";
import { getRatings } from "../controllers/ratingController.js";
import { listPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  MIN_STAKE,
  PROGRAM_ID,
  VERIFY_VOTE_THRESHOLD,
} from "../config/constants.js";

const router = express.Router();

router.get("/config", (_req, res) => {
  res.json({
    programId: process.env.PROGRAM_ID || PROGRAM_ID,
    paymentMint: process.env.PAYMENT_MINT || null,
    rpcUrl: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
    minStake: MIN_STAKE,
    voteThreshold: VERIFY_VOTE_THRESHOLD,
    tokenDecimals: Number(process.env.TOKEN_DECIMALS || 6),
  });
});

router.get("/payments", protect, listPayments);
router.get("/ratings/:userId", protect, getRatings);

export default router;
