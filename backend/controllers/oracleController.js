import DriverLocation from "../models/DriverLocation.js";
import DriverProfile from "../models/DriverProfile.js";
import Ride from "../models/Ride.js";
import { asyncHandler, httpError } from "../middleware/errorHandler.js";

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export const reportLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    throw httpError(400, "lat and lng numbers are required");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw httpError(400, "Invalid coordinates");
  }

  const profile = await DriverProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw httpError(400, "Register as a driver first");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const location = await DriverLocation.findOneAndUpdate(
    { driver: profile._id },
    {
      driver: profile._id,
      user: req.user._id,
      walletAddress: req.user.walletAddress,
      lat,
      lng,
      timestamp,
    },
    { upsert: true, new: true },
  );

  return res.status(200).json({ location });
});

export const getMyLocation = asyncHandler(async (req, res) => {
  const location = await DriverLocation.findOne({ user: req.user._id });
  return res.status(200).json({ location });
});

export const listNearbyDrivers = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const km = Number(req.query.km || 5);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw httpError(400, "lat and lng query params are required");
  }

  const profiles = await DriverProfile.find({
    isVerified: true,
    online: true,
  }).select("_id");
  const ids = profiles.map((item) => item._id);
  const locations = await DriverLocation.find({ driver: { $in: ids } })
    .populate("user", "name rating walletAddress")
    .populate("driver", "vehicle isVerified ratings totalRides");

  const nearby = locations
    .map((item) => ({
      location: item,
      distanceKm: haversineKm(lat, lng, item.lat, item.lng),
    }))
    .filter((item) => item.distanceKm <= km)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return res.status(200).json({ drivers: nearby });
});

export const getRideTracking = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    throw httpError(404, "Ride not found");
  }

  const isParty =
    ride.rider.toString() === req.user._id.toString() ||
    ride.driver?.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!isParty) {
    throw httpError(403, "Unauthorized action");
  }

  if (!["accepted", "in_progress"].includes(ride.status)) {
    throw httpError(400, "Tracking is only available during an active ride");
  }

  const location = await DriverLocation.findOne({ user: ride.driver });
  return res.status(200).json({ rideId: ride._id, location });
});
