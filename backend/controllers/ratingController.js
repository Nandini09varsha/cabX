import Ride from "../models/Ride.js";
import Rating from "../models/Rating.js";
import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";
import { asyncHandler, httpError } from "../middleware/errorHandler.js";

async function recalcRating(userId) {
  const ratings = await Rating.find({ to: userId });
  if (!ratings.length) {
    await User.findByIdAndUpdate(userId, { rating: 0 });
    return 0;
  }
  const avg =
    ratings.reduce((sum, item) => sum + item.score, 0) / ratings.length;
  const rounded = Math.round(avg);
  await User.findByIdAndUpdate(userId, { rating: avg });

  const profile = await DriverProfile.findOne({ user: userId });
  if (profile) {
    profile.ratings = rounded;
    profile.totalRatings = ratings.length;
    await profile.save();
  }
  return avg;
}

export const rateRide = asyncHandler(async (req, res) => {
  const { score } = req.body;
  if (!score || score < 1 || score > 5) {
    throw httpError(400, "score must be between 1 and 5");
  }

  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }
  if (ride.status !== "completed") {
    throw httpError(400, "Ride must be completed before rating");
  }

  const isRider = ride.rider.toString() === req.user._id.toString();
  const isDriver = ride.driver?.toString() === req.user._id.toString();
  if (!isRider && !isDriver) {
    throw httpError(403, "Unauthorized action");
  }

  const to = isRider ? ride.driver : ride.rider;
  if (!to) {
    throw httpError(400, "Missing counterparty");
  }

  let rating;
  try {
    rating = await Rating.create({
      ride: ride._id,
      from: req.user._id,
      to,
      score,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw httpError(409, "Ride already rated");
    }
    throw error;
  }

  const average = await recalcRating(to);
  return res.status(201).json({ rating, average });
});

export const getRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ to: req.params.userId })
    .populate("from", "name role")
    .populate("ride", "source destination amount status")
    .sort({ createdAt: -1 });
  return res.status(200).json({ ratings });
});
