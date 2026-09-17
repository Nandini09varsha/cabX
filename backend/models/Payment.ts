import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
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
    amount: {
      type: String,
      required: true,
    },
    mint: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      enum: ["escrow_lock", "escrow_release", "escrow_refund", "stake", "slash"],
      required: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ ride: 1, kind: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
