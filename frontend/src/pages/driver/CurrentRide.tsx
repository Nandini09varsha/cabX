import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Route,
  Play,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../components/driver/DriverLayout";
import WalletBar from "../../components/WalletBar";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import RatingStars from "../../components/RatingStars";
import { rideApi } from "../../api/cabx";
import { useWallet } from "../../context/WalletContext";
import { useChainAction } from "../../hooks/useChainAction";
import { formatFare, initials, apiError } from "../../lib/format";

function CurrentRide() {
  const navigate = useNavigate();
  const { tokenAccount, ensureReady } = useWallet();
  const { run, busy, error, setError } = useChainAction();
  const [ride, setRide] = useState(null);
  const [score, setScore] = useState(5);
  const [rated, setRated] = useState(false);

  const load = async () => {
    const { data } = await rideApi.active();
    setRide(data.ride);
  };

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
    const timer = setInterval(() => load().catch(() => {}), 8000);
    return () => clearInterval(timer);
  }, [setError]);

  const start = async () => {
    await run(
      async () => (await rideApi.start(ride._id)).data,
      async (signature) => (await rideApi.confirmStart(ride._id, signature)).data,
    );
    await load();
  };

  const complete = async () => {
    const ready = await ensureReady();
    await run(
      async () =>
        (await rideApi.complete(ride._id, { driverTokenAccount: ready.tokenAccount || tokenAccount })).data,
      async (signature) => (await rideApi.confirmComplete(ride._id, signature)).data,
    );
    await load();
  };

  const rate = async () => {
    try {
      await rideApi.rate(ride._id, score);
      setRated(true);
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (!ride) {
    return (
      <DriverLayout activePage="Current Ride">
        <WalletBar />
        <EmptyState
          icon={Navigation}
          title="No current ride"
          text="Accept an open request to start an on-chain trip."
          action={
            <button
              onClick={() => navigate("/driver/requests")}
              className="mt-5 rounded-xl bg-[#F5C518] px-5 py-3 text-sm font-bold text-black"
            >
              View ride requests
            </button>
          }
        />
      </DriverLayout>
    );
  }

  return (
    <DriverLayout activePage="Current Ride">
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Current Ride</h1>
        <StatusBadge status={ride.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#111111]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] text-lg font-bold text-black">
                {initials(ride.rider?.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold">{ride.rider?.name || "Rider"}</h2>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="fill-current text-[#F5C518]" />
                  <span>{Number(ride.rider?.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#111111]">
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-green-600" />
                <div>
                  <p className="text-xs uppercase text-gray-500">Pickup</p>
                  <p className="mt-1 font-semibold">{ride.source}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Navigation className="text-red-500" />
                <div>
                  <p className="text-xs uppercase text-gray-500">Destination</p>
                  <p className="mt-1 font-semibold">{ride.destination}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
              <Route size={17} />
              <p className="mt-2 text-xl font-bold">{ride.distanceKm || "—"} km</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
              <Clock size={17} />
              <p className="mt-2 text-xl font-bold">{ride.durationMin || "—"} min</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
              <p className="text-sm text-gray-500">Fare</p>
              <p className="mt-2 text-xl font-bold">{formatFare(ride.amount)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#111111]">
          {ride.status === "accepted" && (
            <button
              onClick={start}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-5 py-3 font-bold text-black"
            >
              <Play size={18} /> {busy ? "Signing..." : "Start ride"}
            </button>
          )}
          {ride.status === "in_progress" && (
            <button
              onClick={complete}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-5 py-3 font-bold text-black"
            >
              <CheckCircle size={18} /> {busy ? "Releasing escrow..." : "Complete ride"}
            </button>
          )}
          {ride.status === "completed" && !rated && (
            <div>
              <p className="mb-2 text-sm font-semibold">Rate rider</p>
              <RatingStars value={score} onChange={setScore} />
              <button onClick={rate} className="mt-4 w-full rounded-xl bg-[#F5C518] py-3 font-bold text-black">
                Submit rating
              </button>
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}

export default CurrentRide;
