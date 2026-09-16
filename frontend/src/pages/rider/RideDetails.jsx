import { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import RiderLayout from "../../layouts/RiderLayout";
import StatusBadge from "../../components/StatusBadge";
import RatingStars from "../../components/RatingStars";
import { rideApi } from "../../api/cabx";
import { formatDate, formatFare, initials, apiError } from "../../lib/format";

export default function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [score, setScore] = useState(5);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    rideApi
      .get(id)
      .then((res) => setRide(res.data.ride))
      .catch((err) => setError(apiError(err)));
  }, [id]);

  const rate = async () => {
    try {
      await rideApi.rate(id, score);
      setMessage("Rating saved");
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (error && !ride) {
    return (
      <RiderLayout activePage="Ride Details">
        <p className="text-red-500">{error}</p>
      </RiderLayout>
    );
  }

  if (!ride) {
    return (
      <RiderLayout activePage="Ride Details">
        <p>Loading...</p>
      </RiderLayout>
    );
  }

  return (
    <RiderLayout activePage="Ride Details">
      <Link to="/rider/history" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold">
        <ArrowLeft size={17} /> Back to history
      </Link>
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-7 dark:border-[#2A2A2A] dark:bg-[#171717]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Ride #{ride.rideId}</p>
            <h1 className="mt-1 text-2xl font-black">
              {ride.source} → {ride.destination}
            </h1>
          </div>
          <StatusBadge status={ride.status} />
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-[#1e1e1e]">
            <p className="text-xs text-gray-500">Date</p>
            <b>{formatDate(ride.createdAt)}</b>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-[#1e1e1e]">
            <p className="text-xs text-gray-500">Payment</p>
            <b>On-chain escrow</b>
          </div>
        </div>
        <div className="my-7 space-y-5 border-y border-gray-200 py-6 dark:border-[#333]">
          <div className="flex gap-3">
            <MapPin className="text-[#C9A000]" />
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <b>{ride.source}</b>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin />
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <b>{ride.destination}</b>
            </div>
          </div>
        </div>
        {ride.driver && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] font-bold">
              {initials(ride.driver.name)}
            </div>
            <div>
              <b>{ride.driver.name}</b>
              <p className="text-xs text-gray-500">{ride.driver.walletAddress}</p>
            </div>
          </div>
        )}
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Distance</span>
            <b>{ride.distanceKm || "—"} km</b>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg dark:border-[#333]">
            <b>Total fare</b>
            <b>{formatFare(ride.amount)}</b>
          </div>
        </div>
        {ride.status === "completed" && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Rate driver</p>
            <RatingStars value={score} onChange={setScore} />
            <button onClick={rate} className="mt-4 w-full rounded-xl bg-[#F5C518] py-3 font-bold text-black">
              Submit rating
            </button>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </RiderLayout>
  );
}
