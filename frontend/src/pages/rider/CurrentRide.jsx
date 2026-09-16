import { useEffect, useState } from "react";
import { Car, MapPin, Star, X } from "lucide-react";
import RiderLayout from "../../layouts/RiderLayout";
import WalletBar from "../../components/WalletBar";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import RatingStars from "../../components/RatingStars";
import { rideApi } from "../../api/cabx";
import { useChainAction } from "../../hooks/useChainAction";
import { formatFare, initials, apiError } from "../../lib/format";

export default function CurrentRide() {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(5);
  const [rated, setRated] = useState(false);
  const { run, busy, error, setError } = useChainAction();

  const load = async () => {
    const { data } = await rideApi.active();
    setRide(data.ride);
  };

  useEffect(() => {
    load()
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
    const timer = setInterval(() => {
      load().catch(() => {});
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const cancel = async () => {
    if (!ride) return;
    try {
      await run(
        async () => (await rideApi.cancel(ride._id)).data,
        async (signature) => (await rideApi.confirmCancel(ride._id, signature)).data,
      );
      await load();
    } catch {
      /* error surfaced by hook */
    }
  };

  const rate = async () => {
    try {
      await rideApi.rate(ride._id, score);
      setRated(true);
    } catch (err) {
      setError(apiError(err, "Could not submit rating"));
    }
  };

  return (
    <RiderLayout activePage="Current Ride">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Current Ride</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track escrow status from request to completion.
        </p>
      </div>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {loading ? (
        <p>Loading ride...</p>
      ) : !ride ? (
        <EmptyState
          icon={Car}
          title="No active ride"
          text="Book a ride to lock payment in escrow and wait for a driver."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <StatusBadge status={ride.status} />
              <p className="text-sm text-gray-500">Ride #{ride.rideId}</p>
            </div>
            <div className="mt-8 space-y-5">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 text-[#C9A000]" />
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <b>{ride.source}</b>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Destination</p>
                  <b>{ride.destination}</b>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 dark:border-[#333]">
              <span className="text-gray-500">Escrow fare</span>
              <b>{formatFare(ride.amount)}</b>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
            {ride.driver ? (
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] text-lg font-black">
                  {initials(ride.driver.name)}
                </div>
                <div>
                  <b>{ride.driver.name}</b>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <Star size={13} className="fill-current" />{" "}
                    {Number(ride.driver.rating || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-5 rounded-2xl bg-[#FFF9E5] p-4 dark:bg-[#2A2410]">
                <p className="font-semibold">Waiting for a driver</p>
                <p className="mt-1 text-sm text-gray-500">
                  Your request is open on-chain.
                </p>
              </div>
            )}
            {ride.status === "requested" && (
              <button
                onClick={cancel}
                disabled={busy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 p-3 text-sm font-bold text-red-600"
              >
                <X size={16} /> {busy ? "Refunding escrow..." : "Cancel and refund"}
              </button>
            )}
            {ride.status === "completed" && !rated && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold">Rate your driver</p>
                <RatingStars value={score} onChange={setScore} />
                <button
                  onClick={rate}
                  className="mt-4 w-full rounded-xl bg-[#F5C518] py-3 font-bold text-black"
                >
                  Submit rating
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </RiderLayout>
  );
}
