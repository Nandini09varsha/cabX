import { useEffect, useState } from "react";
import { Car, Check, Star, TrendingUp, Wallet, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../components/driver/DriverLayout";
import WalletBar from "../../components/WalletBar";
import { useAuth } from "../../context/AuthContext";
import { driverApi, rideApi } from "../../api/cabx";
import { useChainAction } from "../../hooks/useChainAction";
import { formatFare, initials, apiError } from "../../lib/format";

function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { run, busy, error, setError } = useChainAction();
  const [earnings, setEarnings] = useState({ total: 0, completedRides: 0 });
  const [openRide, setOpenRide] = useState(null);
  const [profile, setProfile] = useState(null);

  const load = async () => {
    const [earn, open, me] = await Promise.allSettled([
      driverApi.earnings(),
      rideApi.open(),
      driverApi.me(),
    ]);
    if (earn.status === "fulfilled") setEarnings(earn.value.data);
    if (open.status === "fulfilled") setOpenRide(open.value.data.rides?.[0] || null);
    if (me.status === "fulfilled") setProfile(me.value.data.driver);
  };

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
  }, [setError]);

  const accept = async () => {
    if (!openRide) return;
    try {
      await run(
        async () => (await rideApi.accept(openRide._id)).data,
        async (signature) => (await rideApi.confirmAccept(openRide._id, signature)).data,
      );
      navigate("/driver/current-ride");
    } catch {
      /* hook */
    }
  };

  return (
    <DriverLayout activePage="Dashboard">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">
          Ready to drive, {user?.name?.split(" ")[0] || "Driver"}?
        </h1>
      </div>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-4 flex items-center justify-between">
            <Wallet size={20} className="text-[#C9A000]" />
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500">Escrow earnings</p>
          <p className="mt-1 text-2xl font-black">{formatFare(earnings.total)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <Car size={20} />
          <p className="mt-4 text-sm text-gray-500">Completed rides</p>
          <p className="mt-1 text-2xl font-black">{earnings.completedRides || 0}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <Star size={20} />
          <p className="mt-4 text-sm text-gray-500">Driver rating</p>
          <p className="mt-1 text-2xl font-black">{Number(user?.rating || 0).toFixed(1)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <Check size={20} />
          <p className="mt-4 text-sm text-gray-500">Verified</p>
          <p className="mt-1 text-2xl font-black">{profile?.isVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
        <h2 className="font-bold">Latest open request</h2>
        {openRide ? (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5C518] font-bold">
                {initials(openRide.rider?.name)}
              </div>
              <div>
                <p className="font-semibold">{openRide.rider?.name || "Rider"}</p>
                <p className="text-xs text-gray-500">
                  {openRide.source} → {openRide.destination}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xl font-black">{formatFare(openRide.amount)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/driver/requests")}
                className="rounded-xl border px-4 py-3 text-sm font-bold dark:border-[#333]"
              >
                View all
              </button>
              <button
                onClick={accept}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-4 py-3 text-sm font-bold text-black"
              >
                <Navigation size={16} />
                {busy ? "Signing..." : "Accept ride"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">No open ride requests right now.</p>
        )}
      </div>
    </DriverLayout>
  );
}

export default DriverDashboard;
