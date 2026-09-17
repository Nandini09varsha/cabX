import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    vehicle: {
      type: {
        type: String,
        trim: true,
      },
      model: {
        type: String,
        trim: true,
      },
      number: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
        trim: true,
      },
    },
    vehicleHash: {
      type: String,
      required: true,
    },
    stakeAmount: {
      type: String,
      default: "0",
    },
    ratings: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    civicIdHash: {
      type: String,
      default: Buffer.alloc(32).toString("hex"),
    },
    civicIdVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    driverPda: String,
    vaultPda: String,
    vaultAuthorityPda: String,
    mint: String,
    registerTx: String,
    verifyTx: String,
    voteCount: {
      type: Number,
      default: 0,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const DriverProfile = mongoose.model("DriverProfile", driverProfileSchema);

export default DriverProfile;
