import mongoose from "mongoose";

const verificationVoteSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

verificationVoteSchema.index({ driver: 1, voter: 1 }, { unique: true });

const VerificationVote = mongoose.model(
  "VerificationVote",
  verificationVoteSchema,
);

export default VerificationVote;
