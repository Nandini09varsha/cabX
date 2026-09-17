import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import WalletBar from "../../components/WalletBar";
import { adminApi, driverApi, miscApi } from "../../api/cabx";
import { useWallet } from "../../context/WalletContext";
import { useChainAction } from "../../hooks/useChainAction";
import { apiError, formatToken, initials } from "../../lib/format";

export default function AdminDashboard() {
  const { tokenAccount, ensureReady } = useWallet();
  const { run, busy, error, setError } = useChainAction();
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState("");
  const [slashAmount, setSlashAmount] = useState("0.1");
  const [decimals, setDecimals] = useState(6);

  const load = () =>
    driverApi.list().then((res) => setDrivers(res.data.drivers || []));

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
    miscApi.config().then((res) => setDecimals(res.data.tokenDecimals || 6));
  }, [setError]);

  const initialize = async () => {
    setMessage("");
    try {
      await run(async () => (await adminApi.initialize()).data);
      setMessage("Admin state initialized on-chain");
    } catch {
      /* hook */
    }
  };

  const verify = async (driverId) => {
    setMessage("");
    try {
      await run(
        async () => (await adminApi.verify(driverId)).data,
        async (signature) => (await adminApi.confirmVerify(driverId, signature)).data,
      );
      setMessage("Driver verified on-chain");
      await load();
    } catch {
      /* hook */
    }
  };

  const slash = async (driverId) => {
    setMessage("");
    try {
      const ready = await ensureReady();
      const amount = String(Math.round(Number(slashAmount) * 10 ** decimals));
      await run(
        async () =>
          (
            await adminApi.slash(driverId, {
              slashAmount: amount,
              treasuryTokenAccount: ready.tokenAccount || tokenAccount,
            })
          ).data,
        async (signature) =>
          (await adminApi.confirmSlash(driverId, { signature, slashAmount: amount })).data,
      );
      setMessage("Stake slashed");
      await load();
    } catch {
      /* hook */
    }
  };

  return (
    <AdminLayout activePage="Overview">
      <h1 className="text-3xl font-black">Admin control</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Initialize program admin state, verify drivers, and slash stake.
      </p>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <button
        onClick={initialize}
        disabled={busy}
        className="mb-6 rounded-xl bg-[#F5C518] px-5 py-3 font-bold text-black"
      >
        {busy ? "Signing..." : "Initialize admin state"}
      </button>
      <label className="mb-4 block max-w-xs text-sm font-medium">
        Slash amount
        <input
          className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-[#333]"
          value={slashAmount}
          onChange={(e) => setSlashAmount(e.target.value)}
        />
      </label>
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
                <b>{driver.user?.name}</b>
                <p className="text-xs text-gray-500">
                  Stake {formatToken(driver.stakeAmount, decimals)} CX · votes {driver.voteCount || 0} ·{" "}
                  {driver.isVerified ? "Verified" : "Unverified"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!driver.isVerified && (
                <button
                  onClick={() => verify(driver._id)}
                  className="rounded-xl bg-[#F5C518] px-4 py-2 text-sm font-bold text-black"
                >
                  Verify
                </button>
              )}
              <button
                onClick={() => slash(driver._id)}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600"
              >
                Slash
              </button>
            </div>
          </div>
        ))}
        {drivers.length === 0 && <p className="text-sm text-gray-500">No drivers registered yet.</p>}
      </div>
    </AdminLayout>
  );
}
