import { useEffect, useState } from "react";
import DriverLayout from "../../components/driver/DriverLayout";
import WalletBar from "../../components/WalletBar";
import { driverApi, miscApi } from "../../api/cabx";
import { useWallet } from "../../context/WalletContext";
import { useChainAction } from "../../hooks/useChainAction";
import { formatToken, fromChainAmount, toChainAmount, apiError } from "../../lib/format";

export default function RegisterDriver() {
  const { tokenAccount, ensureReady } = useWallet();
  const { run, busy, error, setError } = useChainAction();
  const [profile, setProfile] = useState(null);
  const [onchain, setOnchain] = useState(null);
  const [minStake, setMinStake] = useState(1);
  const [decimals, setDecimals] = useState(6);
  const [stake, setStake] = useState("1");
  const [vehicle, setVehicle] = useState({
    type: "Sedan",
    model: "",
    number: "",
    color: "White",
  });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [{ data: me }, { data: config }] = await Promise.all([
      driverApi.me(),
      miscApi.config(),
    ]);
    setProfile(me.driver);
    setOnchain(me.onchain);
    setDecimals(config.tokenDecimals || 6);
    setMinStake(fromChainAmount(config.minStake, config.tokenDecimals || 6));
    if (me.driver?.vehicle) {
      setVehicle({
        type: me.driver.vehicle.type || "Sedan",
        model: me.driver.vehicle.model || "",
        number: me.driver.vehicle.number || "",
        color: me.driver.vehicle.color || "White",
      });
    }
  };

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
  }, [setError]);

  const register = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const ready = await ensureReady();
      await run(
        async () => {
          const { data } = await driverApi.register({
            vehicle,
            stakeAmount: toChainAmount(stake, decimals),
            driverTokenAccount: ready.tokenAccount || tokenAccount,
          });
          return data;
        },
        async (signature) => (await driverApi.confirmRegister(signature)).data,
      );
      setMessage("Stake locked on-chain. Community votes can now verify you.");
      await load();
    } catch {
      /* hook error */
    }
  };

  return (
    <DriverLayout activePage="Stake">
      <h1 className="text-3xl font-black">Driver stake</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Register your vehicle and lock the minimum stake before accepting rides.
      </p>
      <WalletBar />
      {profile && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 ">
            <p className="text-xs text-muted-foreground">Verified</p>
            <b>{profile.isVerified ? "Yes" : "No"}</b>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 ">
            <p className="text-xs text-muted-foreground">Stake</p>
            <b>{formatToken(profile.stakeAmount, decimals)} CX</b>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 ">
            <p className="text-xs text-muted-foreground">Votes</p>
            <b>{profile.voteCount || 0}</b>
          </div>
        </div>
      )}
      <form
        onSubmit={register}
        className="max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-6 "
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {["type", "model", "number", "color"].map((field) => (
            <label key={field} className="text-sm font-medium capitalize">
              {field}
              <input
                required
                className="mt-2 w-full rounded-xl border border-border bg-transparent p-3 "
                value={vehicle[field]}
                onChange={(e) => setVehicle({ ...vehicle, [field]: e.target.value })}
              />
            </label>
          ))}
          <label className="text-sm font-medium">
            Stake amount (min {minStake})
            <input
              required
              type="number"
              min={minStake}
              step="0.01"
              className="mt-2 w-full rounded-xl border border-border bg-transparent p-3 "
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        {onchain && <p className="text-xs text-muted-foreground">On-chain account found for this wallet.</p>}
        <button
          disabled={busy}
          className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Waiting for wallet..." : "Lock stake"}
        </button>
      </form>
    </DriverLayout>
  );
}
