import { useEffect, useState } from "react";
import { Car, Check, Clock3, MapPin, Navigation, Star, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../components/driver/DriverLayout";
import WalletBar from "../../components/WalletBar";
import EmptyState from "../../components/EmptyState";
import { rideApi } from "../../api/cabx";
import { useChainAction } from "../../hooks/useChainAction";
import { formatFare, initials, apiError } from "../../lib/format";

function RideRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const { run, busy, error, setError } = useChainAction();

  const load = () =>
    rideApi.open().then((res) => setRequests(res.data.rides || []));

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
    const timer = setInterval(() => load().catch(() => {}), 8000);
    return () => clearInterval(timer);
  }, [setError]);

  const handleAccept = async (request) => {
    try {
      await run(
        async () => (await rideApi.accept(request._id)).data,
        async (signature) => (await rideApi.confirmAccept(request._id, signature)).data,
      );
      navigate("/driver/current-ride");
    } catch {
      /* hook */
    }
  };

  return (
    <DriverLayout activePage="Ride Requests">
      <div className="mb-6">
        <h1 className="text-2xl font-black sm:text-3xl">Ride Requests</h1>
        <p className="mt-1 text-sm text-gray-500">Open escrowed rides waiting for a driver.</p>
      </div>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {requests.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No ride requests right now"
          text="Stay online. New requested rides will appear after a rider locks escrow."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]"
            >
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-[#2A2A2A] md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] text-lg font-black text-black">
                    {initials(request.rider?.name)}
                  </div>
                  <div>
                    <p className="font-bold">{request.rider?.name || "Rider"}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Star size={12} className="fill-current text-[#F5C518]" />
                      <span>{Number(request.rider?.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-xs text-gray-500">Escrow fare</p>
                  <p className="text-2xl font-black">{formatFare(request.amount)}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-3.5 w-3.5 rounded-full border-[3px] border-[#F5C518]" />
                    <div className="my-1 h-12 border-l border-dashed border-gray-300" />
                    <div className="h-3.5 w-3.5 rounded-sm bg-black dark:bg-white" />
                  </div>
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase text-gray-400">
                        <MapPin size={14} /> Pickup
                      </p>
                      <p className="mt-1 text-sm font-semibold">{request.source}</p>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase text-gray-400">
                        <Navigation size={14} /> Destination
                      </p>
                      <p className="mt-1 text-sm font-semibold">{request.destination}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                    <p className="text-[11px] text-gray-400">Distance</p>
                    <p className="mt-1 text-sm font-bold">{request.distanceKm || "—"} km</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                    <Clock3 size={16} className="mx-auto mb-1 text-gray-500" />
                    <p className="text-[11px] text-gray-400">Duration</p>
                    <p className="mt-1 text-sm font-bold">{request.durationMin || "—"} min</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                    <Wallet size={16} className="mx-auto mb-1 text-gray-500" />
                    <p className="text-[11px] text-gray-400">Fare</p>
                    <p className="mt-1 text-sm font-bold">{formatFare(request.amount)}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRequests((prev) => prev.filter((r) => r._id !== request._id))}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold dark:border-[#3A3A3A]"
                  >
                    <X size={17} /> Skip
                  </button>
                  <button
                    onClick={() => handleAccept(request)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-4 py-3 text-sm font-bold text-black"
                  >
                    <Check size={17} /> {busy ? "Signing..." : "Accept Ride"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DriverLayout>
  );
}

export default RideRequests;
