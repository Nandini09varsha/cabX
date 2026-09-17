import DriverProfile from "../models/DriverProfile.ts";
import Payment from "../models/Payment.ts";
import { asyncHandler, httpError } from "../middleware/errorHandler.ts";
import {
  buildInitializeAdminTx,
  buildSlashDriverTx,
  buildVerifyDriverTx,
} from "../services/driverProgram.ts";
import { syncDriverFromChain } from "../services/sync.ts";
import { adminKeypair, hasAdminSigner } from "../config/solana.ts";

export const initializeAdmin = asyncHandler(async (req, res) => {
  const authority = req.user.walletAddress || adminKeypair.publicKey.toBase58();
  const built = await buildInitializeAdminTx(authority);
  return res.status(200).json({
    message: "Sign and submit this transaction to initialize admin state",
    ...built,
  });
});

export const verifyDriver = asyncHandler(async (req, res) => {
  const profile = await DriverProfile.findById(req.params.driverId);
  if (!profile) {
    throw httpError(404, "Driver not found");
  }
  if (profile.isVerified) {
    throw httpError(400, "Driver is already verified");
  }

  const authority = hasAdminSigner
    ? adminKeypair.publicKey.toBase58()
    : req.user.walletAddress;

  const built = await buildVerifyDriverTx({
    driverAuthority: profile.walletAddress,
    adminAuthority: authority,
  });

  return res.status(200).json({
    message: "Sign and submit this transaction to verify the driver",
    driver: profile,
    ...built,
  });
});

export const confirmVerifyDriver = asyncHandler(async (req, res) => {
  const profile = await DriverProfile.findById(req.params.driverId);
  if (!profile) {
    throw httpError(404, "Driver not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  profile.verifyTx = req.body.signature;
  profile.isVerified = true;
  profile.verifiedAt = new Date();
  await profile.save();
  await syncDriverFromChain(profile);

  return res.status(200).json({ driver: profile });
});

export const slashDriver = asyncHandler(async (req, res) => {
  const { slashAmount, treasuryTokenAccount } = req.body;
  if (!slashAmount || !treasuryTokenAccount) {
    throw httpError(400, "slashAmount and treasuryTokenAccount are required");
  }
  if (Number(slashAmount) <= 0) {
    throw httpError(400, "Invalid amount");
  }

  const profile = await DriverProfile.findById(req.params.driverId);
  if (!profile) {
    throw httpError(404, "Driver not found");
  }
  if (Number(slashAmount) > Number(profile.stakeAmount)) {
    throw httpError(400, "Slash amount exceeds available stake");
  }

  const authority = hasAdminSigner
    ? adminKeypair.publicKey.toBase58()
    : req.user.walletAddress;

  const built = await buildSlashDriverTx({
    driverAuthority: profile.walletAddress,
    adminAuthority: authority,
    treasuryTokenAccount,
    slashAmount,
  });

  return res.status(200).json({
    message: "Sign and submit this transaction to slash driver stake",
    driver: profile,
    ...built,
  });
});

export const confirmSlashDriver = asyncHandler(async (req, res) => {
  const profile = await DriverProfile.findById(req.params.driverId);
  if (!profile) {
    throw httpError(404, "Driver not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  await syncDriverFromChain(profile);
  await Payment.create({
    rider: profile.user,
    driver: profile.user,
    amount: String(req.body.slashAmount || "0"),
    mint: profile.mint || "",
    signature: req.body.signature,
    kind: "slash",
  });

  return res.status(200).json({ driver: profile });
});
