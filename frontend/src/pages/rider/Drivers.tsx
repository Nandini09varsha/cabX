import { useEffect, useState } from "react";
import { ShieldCheck, Star } from "lucide-react";
import RiderLayout from "../../layouts/RiderLayout";
import EmptyState from "../../components/EmptyState";
import { driverApi } from "../../api/cabx";
import { apiError, initials } from "../../lib/format";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () =>
    driverApi.list().then((res) => setDrivers(res.data.drivers || []));

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
  }, []);

  const vote = async (id) => {
    setError("");
    setMessage("");
    try {
      const { data } = await driverApi.vote(id);
      setMessage(`Vote recorded (${data.voteCount}/${data.threshold})`);
      await load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <RiderLayout activePage="Drivers">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Community drivers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vote to help verify staked drivers. GPS tracking is paused for now.
        </p>
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      {drivers.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No drivers yet" text="Drivers appear here after they stake on-chain." />
      ) : (
        <div className="space-y-3">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#2A2A2A] dark:bg-[#171717]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] font-black">
                  {initials(driver.user?.name)}
                </div>
                <div>
                  <b>{driver.user?.name || "Driver"}</b>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="fill-current" />
                    {Number(driver.user?.rating || 0).toFixed(1)} · {driver.voteCount || 0} votes
                    {driver.isVerified ? " · Verified" : " · Unverified"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => vote(driver._id)}
                className="rounded-xl bg-[#F5C518] px-4 py-2 text-sm font-bold text-black"
              >
                Vote to verify
              </button>
            </div>
          ))}
        </div>
      )}
    </RiderLayout>
  );
}
