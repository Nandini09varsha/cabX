import Payment from "../models/Payment.js";
import Ride from "../models/Ride.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listPayments = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "driver"
      ? { driver: req.user._id }
      : req.user.role === "admin"
        ? {}
        : { rider: req.user._id };

  const payments = await Payment.find(filter)
    .populate("ride", "source destination status amount rideId")
    .sort({ createdAt: -1 });

  return res.status(200).json({ payments });
});

export const getEarnings = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    driver: req.user._id,
    kind: "escrow_release",
  });

  const total = payments.reduce((sum, item) => sum + Number(item.amount), 0);
  const completed = await Ride.countDocuments({
    driver: req.user._id,
    status: "completed",
  });

  return res.status(200).json({
    total,
    count: payments.length,
    completedRides: completed,
    payments,
  });
});
