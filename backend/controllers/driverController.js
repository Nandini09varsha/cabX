import DriverProfile from "../models/DriverProfile.js";
import VerificationVote from "../models/VerificationVote.js";
import { MIN_STAKE, VERIFY_VOTE_THRESHOLD } from "../config/constants.js";
import { asyncHandler, httpError } from "../middleware/errorHandler.js";
import { hashVehicle, bytesToHex } from "../services/hash.js";
import {
  buildRegisterDriverTx,
  buildVerifyDriverTx,
  fetchDriverAccount,
  serializeDriverAccount,
} from "../services/driverProgram.js";
import { recordPayment, syncDriverFromChain } from "../services/sync.js";
import { adminKeypair, hasAdminSigner } from "../config/solana.js";

async function getOrCreateProfile(user) {
  let profile = await DriverProfile.findOne({ user: user._id });
  if (profile) {
    return profile;
  }
  if (!user.walletAddress) {
    throw httpError(400, "Link a Solana wallet before continuing");
  }
  profile = await DriverProfile.create({
    user: user._id,
    walletAddress: user.walletAddress,
    vehicleHash: Buffer.alloc(32).toString("hex"),
  });
  return profile;
}

export const getDriverMe = asyncHandler(async (req, res) => {
  if (!req.user.walletAddress) {
    return res.status(200).json({
      user: req.user,
      driver: null,
      onchain: null,
    });
  }

  const profile = await getOrCreateProfile(req.user);
  await syncDriverFromChain(profile);
  const onchain = serializeDriverAccount(
    (await fetchDriverAccount(profile.walletAddress)).account,
  );

  return res.status(200).json({
    user: req.user,
    driver: profile,
    onchain,
  });
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile(req.user);
  if (typeof req.body.online !== "boolean") {
    throw httpError(400, "online boolean is required");
  }
  profile.online = req.body.online;
  await profile.save();
  return res.status(200).json({ driver: profile });
});

export const registerDriver = asyncHandler(async (req, res) => {
  const { vehicle, stakeAmount, driverTokenAccount, mint } = req.body;

  if (!vehicle || !stakeAmount || !driverTokenAccount) {
    throw httpError(
      400,
      "vehicle, stakeAmount and driverTokenAccount are required",
    );
  }

  if (Number(stakeAmount) < MIN_STAKE) {
    throw httpError(400, "Stake amount is too low");
  }

  const vehicleHash = hashVehicle(vehicle);
  const built = await buildRegisterDriverTx({
    authority: req.user.walletAddress,
    driverTokenAccount,
    stakeAmount,
    vehicleHash,
    mint,
  });

  const profile = await getOrCreateProfile(req.user);
  profile.vehicle = vehicle;
  profile.vehicleHash = bytesToHex(vehicleHash);
  profile.stakeAmount = String(stakeAmount);
  profile.driverPda = built.driverPda;
  profile.vaultPda = built.vaultPda;
  profile.vaultAuthorityPda = built.vaultAuthorityPda;
  profile.mint = built.mint;
  await profile.save();

  return res.status(200).json({
    message: "Sign and submit this transaction to lock driver stake",
    ...built,
    driver: profile,
  });
});

export const confirmDriverRegister = asyncHandler(async (req, res) => {
  const { signature } = req.body;
  if (!signature) {
    throw httpError(400, "signature is required");
  }

  const profile = await getOrCreateProfile(req.user);
  profile.registerTx = signature;
  await profile.save();
  await syncDriverFromChain(profile);
  await recordPayment({
    rider: req.user._id,
    driver: req.user._id,
    amount: profile.stakeAmount,
    mint: profile.mint || "",
    signature,
    kind: "stake",
  });

  return res.status(200).json({
    message: "Driver registration confirmed",
    driver: profile,
  });
});

export const voteVerifyDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const profile = await DriverProfile.findById(driverId);

  if (!profile) {
    throw httpError(404, "Driver not found");
  }

  if (profile.user.toString() === req.user._id.toString()) {
    throw httpError(400, "Drivers cannot vote for themselves");
  }

  try {
    await VerificationVote.create({
      driver: profile._id,
      voter: req.user._id,
    });
  } catch (_error) {
    throw httpError(409, "Already voted for this driver");
  }

  profile.voteCount = await VerificationVote.countDocuments({
    driver: profile._id,
  });
  await profile.save();

  const eligible = profile.voteCount >= VERIFY_VOTE_THRESHOLD;
  let verifyTx = null;

  if (eligible && !profile.isVerified && hasAdminSigner) {
    verifyTx = await buildVerifyDriverTx({
      driverAuthority: profile.walletAddress,
      adminAuthority: adminKeypair.publicKey,
    });
  }

  return res.status(200).json({
    voteCount: profile.voteCount,
    threshold: VERIFY_VOTE_THRESHOLD,
    eligible,
    verifyTx,
  });
});

export const listDrivers = asyncHandler(async (req, res) => {
  const { verified } = req.query;
  const filter = {};
  if (verified === "true") filter.isVerified = true;
  if (verified === "false") filter.isVerified = false;

  const drivers = await DriverProfile.find(filter)
    .populate("user", "name rating walletAddress")
    .sort({ voteCount: -1 });

  return res.status(200).json({ drivers });
});
