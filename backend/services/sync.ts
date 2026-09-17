import Ride from "../models/Ride.ts";
import DriverProfile from "../models/DriverProfile.ts";
import Payment from "../models/Payment.ts";
import { chainStatusToLocal } from "./tx.ts";
import { fetchRideAccount, serializeRideAccount } from "./rideProgram.ts";
import { fetchDriverAccount, serializeDriverAccount } from "./driverProgram.ts";

export async function syncRideFromChain(ride) {
  const { account } = await fetchRideAccount(ride.riderWallet, ride.rideId);
  if (!account) {
    return ride;
  }

  const localStatus = chainStatusToLocal(account.status);
  ride.status = localStatus || ride.status;
  ride.amount = account.amount.toString();
  ride.driverWallet = account.driver.toBase58();
  ride.onchainTimestamp = Number(account.timestamp);
  ride.bump = account.bump;
  await ride.save();
  return ride;
}

export async function syncDriverFromChain(profile) {
  const { account } = await fetchDriverAccount(profile.walletAddress);
  if (!account) {
    return profile;
  }

  profile.stakeAmount = account.stakeAmount.toString();
  profile.ratings = account.ratings;
  profile.totalRatings = Number(account.totalRatings);
  profile.totalRides = Number(account.totalRides);
  profile.isVerified = account.isVerified;
  profile.civicIdVerified = account.civicIdVerified;
  profile.civicIdHash = Buffer.from(account.civicIdHash).toString("hex");
  if (account.verifiedAt && Number(account.verifiedAt) > 0) {
    profile.verifiedAt = new Date(Number(account.verifiedAt) * 1000);
  }
  await profile.save();
  return profile;
}

export async function recordPayment({ ride, rider, driver, amount, mint, signature, kind }) {
  const filter = ride?._id ? { ride: ride._id, kind } : { signature, kind };
  return Payment.findOneAndUpdate(
    filter,
    {
      ride: ride?._id,
      rider,
      driver,
      amount,
      mint,
      signature,
      kind,
    },
    { upsert: true, new: true },
  );
}

export { serializeRideAccount, serializeDriverAccount };
