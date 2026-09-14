import mongoose from "mongoose";
import { RIDE_STATUSES } from "../config/constants.js";

const rideSchema = new mongoose.Schema(
  {
    rideId: {
      type: Number,
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    riderWallet: {
      type: String,
      required: true,
    },
    driverWallet: {
      type: String,
      default: "11111111111111111111111111111111",
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: RIDE_STATUSES,
      default: "requested",
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    sourceHash: {
      type: String,
      required: true,
    },
    destinationHash: {
      type: String,
      required: true,
    },
    ridePda: {
      type: String,
      required: true,
      unique: true,
    },
    vaultB: {
      type: String,
      required: true,
    },
    mint: {
      type: String,
      required: true,
    },
    riderTokenAccount: String,
    driverTokenAccount: String,
    onchainTimestamp: Number,
    bump: Number,
    rideType: String,
    distanceKm: Number,
    durationMin: Number,
    requestTx: String,
    acceptTx: String,
    startTx: String,
    cancelTx: String,
    completeTx: String,
  },
  { timestamps: true },
);

rideSchema.index({ rider: 1, rideId: 1 }, { unique: true });
rideSchema.index({ status: 1, createdAt: -1 });

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
