import User from "../models/User.ts";
import Ride from "../models/Ride.ts";
import { asyncHandler, httpError } from "../middleware/errorHandler.ts";

export const getProfile = asyncHandler(async (req, res) => {
  const rides = await Ride.countDocuments({
    rider: req.user._id,
    status: "completed",
  });

  return res.status(200).json({
    user: req.user,
    stats: {
      completedRides: rides,
      rating: req.user.rating,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, tokenAccount } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (tokenAccount) updates.tokenAccount = tokenAccount;

  if (Object.keys(updates).length === 0) {
    throw httpError(400, "Nothing to update");
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  return res.status(200).json({ message: "Profile updated", user: updatedUser });
});
