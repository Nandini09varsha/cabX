import Ride from "../models/Ride.ts";
import DriverProfile from "../models/DriverProfile.ts";
import { asyncHandler, httpError } from "../middleware/errorHandler.ts";
import { bytesToHex, hashPlace } from "../services/hash.ts";
import {
  buildAcceptRideTx,
  buildCancelRideTx,
  buildCompleteRideTx,
  buildRequestRideTx,
  buildStartRideTx,
  fetchRideAccount,
  serializeRideAccount,
} from "../services/rideProgram.ts";
import { recordPayment, syncRideFromChain } from "../services/sync.ts";

function riderToken(user, override) {
  const account = override || user.tokenAccount;
  if (!account) {
    throw httpError(400, "riderTokenAccount is required");
  }
  return account;
}

function driverToken(user, override) {
  const account = override || user.tokenAccount;
  if (!account) {
    throw httpError(400, "driverTokenAccount is required");
  }
  return account;
}

export const requestRide = asyncHandler(async (req, res) => {
  const {
    source,
    destination,
    amount,
    riderTokenAccount,
    mint,
    rideType,
    distanceKm,
    durationMin,
  } = req.body;

  if (!source || !destination || !amount) {
    throw httpError(400, "source, destination and amount are required");
  }

  if (Number(amount) <= 0) {
    throw httpError(400, "Invalid amount");
  }

  const sourceHash = hashPlace(source);
  const destinationHash = hashPlace(destination);
  const rideId = req.user.nextRideId;
  const tokenAccount = riderToken(req.user, riderTokenAccount);

  const built = await buildRequestRideTx({
    rider: req.user.walletAddress,
    riderTokenAccount: tokenAccount,
    rideId,
    sourceHash,
    destinationHash,
    amount,
    mint,
  });

  const ride = await Ride.create({
    rideId,
    rider: req.user._id,
    riderWallet: req.user.walletAddress,
    amount: String(amount),
    status: "requested",
    source,
    destination,
    sourceHash: bytesToHex(sourceHash),
    destinationHash: bytesToHex(destinationHash),
    ridePda: built.ridePda,
    vaultB: built.vaultB,
    mint: built.mint,
    riderTokenAccount: tokenAccount,
    rideType,
    distanceKm,
    durationMin,
  });

  req.user.nextRideId = rideId + 1;
  req.user.tokenAccount = tokenAccount;
  await req.user.save();

  return res.status(201).json({
    message: "Sign and submit this transaction to lock ride payment",
    ride,
    ...built,
  });
});

export const confirmRideRequest = asyncHandler(async (req, res) => {
  const ride = await Ride.findOne({
    _id: req.params.id,
    rider: req.user._id,
  });
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  ride.requestTx = req.body.signature;
  await ride.save();
  await syncRideFromChain(ride);
  await recordPayment({
    ride,
    rider: ride.rider,
    driver: ride.driver || ride.rider,
    amount: ride.amount,
    mint: ride.mint,
    signature: req.body.signature,
    kind: "escrow_lock",
  });

  return res.status(200).json({ ride });
});

export const listOpenRides = asyncHandler(async (_req, res) => {
  const rides = await Ride.find({ status: "requested" })
    .populate("rider", "name rating walletAddress")
    .sort({ createdAt: -1 });
  return res.status(200).json({ rides });
});

export const listMyRides = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "driver"
      ? { driver: req.user._id }
      : { rider: req.user._id };

  const rides = await Ride.find(filter)
    .populate("rider", "name rating walletAddress")
    .populate("driver", "name rating walletAddress")
    .sort({ createdAt: -1 });

  return res.status(200).json({ rides });
});

export const getRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id)
    .populate("rider", "name rating walletAddress phone")
    .populate("driver", "name rating walletAddress phone");

  if (!ride) {
    throw httpError(404, "Ride not found");
  }

  const isParty =
    ride.rider._id.toString() === req.user._id.toString() ||
    ride.driver?._id?.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!isParty && ride.status !== "requested") {
    throw httpError(403, "Forbidden");
  }

  await syncRideFromChain(ride);
  const onchain = serializeRideAccount(
    (await fetchRideAccount(ride.riderWallet, ride.rideId)).account,
  );

  return res.status(200).json({ ride, onchain });
});

export const acceptRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (ride.status !== "requested") {
    throw httpError(400, "Ride is not available for acceptance");
  }

  const profile = await DriverProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw httpError(400, "Register as a driver first");
  }
  await syncRideFromChain(ride);

  const built = await buildAcceptRideTx({
    riderWallet: ride.riderWallet,
    rideId: ride.rideId,
    driverAuthority: req.user.walletAddress,
  });

  return res.status(200).json({
    message: "Sign and submit this transaction to accept the ride",
    ride,
    ...built,
  });
});

export const confirmAcceptRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  ride.acceptTx = req.body.signature;
  ride.driver = req.user._id;
  ride.driverWallet = req.user.walletAddress;
  ride.status = "accepted";
  await ride.save();
  await syncRideFromChain(ride);

  return res.status(200).json({ ride });
});

export const startRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (ride.driver?.toString() !== req.user._id.toString()) {
    throw httpError(403, "Unauthorized action");
  }
  if (ride.status !== "accepted") {
    throw httpError(400, "Ride is not available");
  }

  const built = await buildStartRideTx({
    riderWallet: ride.riderWallet,
    rideId: ride.rideId,
    driverAuthority: req.user.walletAddress,
  });

  return res.status(200).json({
    message: "Sign and submit this transaction to start the ride",
    ride,
    ...built,
  });
});

export const confirmStartRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  ride.startTx = req.body.signature;
  ride.status = "in_progress";
  await ride.save();
  await syncRideFromChain(ride);

  return res.status(200).json({ ride });
});

export const cancelRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (ride.rider.toString() !== req.user._id.toString()) {
    throw httpError(403, "Unauthorized action");
  }
  if (ride.status !== "requested") {
    throw httpError(400, "Ride is not available");
  }

  const built = await buildCancelRideTx({
    riderWallet: ride.riderWallet,
    rideId: ride.rideId,
    vaultB: ride.vaultB,
    riderTokenAccount: riderToken(req.user, req.body.riderTokenAccount || ride.riderTokenAccount),
  });

  return res.status(200).json({
    message: "Sign and submit this transaction to refund escrow",
    ride,
    ...built,
  });
});

export const confirmCancelRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  ride.cancelTx = req.body.signature;
  ride.status = "canceled";
  await ride.save();
  await syncRideFromChain(ride);
  await recordPayment({
    ride,
    rider: ride.rider,
    driver: ride.driver || ride.rider,
    amount: ride.amount,
    mint: ride.mint,
    signature: req.body.signature,
    kind: "escrow_refund",
  });

  return res.status(200).json({ ride });
});

export const completeRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (ride.driver?.toString() !== req.user._id.toString()) {
    throw httpError(403, "Unauthorized action");
  }
  if (ride.status !== "in_progress") {
    throw httpError(400, "Ride is not available");
  }

  const tokenAccount = driverToken(req.user, req.body.driverTokenAccount);
  const built = await buildCompleteRideTx({
    riderWallet: ride.riderWallet,
    rideId: ride.rideId,
    driverAuthority: req.user.walletAddress,
    vaultB: ride.vaultB,
    driverTokenAccount: tokenAccount,
  });

  ride.driverTokenAccount = tokenAccount;
  await ride.save();

  return res.status(200).json({
    message: "Sign and submit this transaction to release payment",
    ride,
    ...built,
  });
});

export const confirmCompleteRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (!req.body.signature) {
    throw httpError(400, "signature is required");
  }

  ride.completeTx = req.body.signature;
  ride.status = "completed";
  await ride.save();
  await syncRideFromChain(ride);

  const profile = await DriverProfile.findOne({ user: ride.driver });
  if (profile) {
    profile.totalRides += 1;
    await profile.save();
  }

  await recordPayment({
    ride,
    rider: ride.rider,
    driver: ride.driver,
    amount: ride.amount,
    mint: ride.mint,
    signature: req.body.signature,
    kind: "escrow_release",
  });

  return res.status(200).json({ ride });
});

export const getCurrentRide = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "driver"
      ? { driver: req.user._id, status: { $in: ["accepted", "in_progress"] } }
      : { rider: req.user._id, status: { $in: ["requested", "accepted", "in_progress"] } };

  const ride = await Ride.findOne(filter)
    .populate("rider", "name rating walletAddress phone")
    .populate("driver", "name rating walletAddress phone")
    .sort({ updatedAt: -1 });

  return res.status(200).json({ ride });
});

