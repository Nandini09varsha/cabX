import { useState } from "react";
import { Car, CheckCircle2, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import RiderLayout from "../../layouts/RiderLayout";
import WalletBar from "../../components/WalletBar";
import { rideTypes } from "../../data/riderMockData";
import { rideApi } from "../../api/cabx";
import { useWallet } from "../../context/WalletContext";
import { useChainAction } from "../../hooks/useChainAction";
import { apiError, toChainAmount } from "../../lib/format";

export default function BookRide() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { tokenAccount, ensureReady } = useWallet();
  const { run, busy, error, setError } = useChainAction();
  const [pickup, setPickup] = useState("Indirapuram Habitat Centre");
  const [destination, setDestination] = useState(loc.state?.destination || "");
  const [type, setType] = useState(loc.state?.selected || "mini");
  const [confirmed, setConfirmed] = useState(null);
  const selected = rideTypes.find((x) => x.id === type);

  const handleConfirm = async () => {
    if (!destination.trim() || !pickup.trim() || !selected) return;
    try {
      const ready = await ensureReady();
      await run(
        async () => {
          const { data } = await rideApi.request({
            source: pickup.trim(),
            destination: destination.trim(),
            amount: toChainAmount(selected.fare),
            riderTokenAccount: ready.tokenAccount || tokenAccount,
            rideType: selected.id,
            distanceKm: selected.distanceKm,
            durationMin: selected.durationMin,
          });
          return data;
        },
        async (signature, built) => {
          const { data } = await rideApi.confirmRequest(built.ride._id, signature);
          return data;
        },
      );
      setConfirmed(true);
      navigate("/rider/current-ride");
    } catch (err) {
      setError(apiError(err, "Could not lock ride escrow"));
    }
  };

  return (
    <RiderLayout activePage="Book a Ride">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Book a Ride</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a route and lock fare into on-chain escrow.
        </p>
      </div>
      <WalletBar />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl border border-border bg-card p-6 ">
          <div
            className="h-64 rounded-2xl bg-muted"
            style={{
              backgroundImage:
                "linear-gradient(35deg,transparent 48%,#bbb 49%,#bbb 51%,transparent 52%),linear-gradient(120deg,transparent 46%,#ccc 47%,#ccc 49%,transparent 50%)",
              backgroundSize: "120px 90px,160px 110px",
            }}
          />
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-semibold">
              Pickup
              <input
                className="mt-2 w-full rounded-xl border border-border bg-transparent p-3 outline-none "
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Destination
              <input
                className="mt-2 w-full rounded-xl border border-border bg-transparent p-3 outline-none "
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 ">
          <h2 className="text-lg font-bold">Choose your ride</h2>
          <div className="mt-4 space-y-2">
            {rideTypes.map((r) => (
              <button
                key={r.id}
                onClick={() => setType(r.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${
                  type === r.id
                    ? "border-primary bg-accent-soft"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                    <Car size={19} />
                  </div>
                  <div>
                    <b>{r.label}</b>
                    <p className="text-xs text-muted-foreground">
                      {r.seats} seats · {r.eta} away
                    </p>
                  </div>
                </div>
                <b>₹{r.fare}</b>
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-3 rounded-2xl bg-muted/50 p-4">
            <div className="flex justify-between text-sm">
              <span>Distance</span>
              <b>{selected?.distanceKm} km</b>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated time</span>
              <b>{selected?.durationMin} min</b>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment</span>
              <b className="flex items-center gap-1">
                <Wallet size={15} /> Escrow
              </b>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg ">
              <b>Escrow fare</b>
              <b>₹{selected?.fare}</b>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={!destination || busy}
            className="mt-5 w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Waiting for wallet..." : "Confirm and lock escrow"}
          </button>
          {confirmed && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2 size={20} />
              <div>
                <b>Ride escrow locked</b>
                <p className="text-sm">Drivers can now accept this request on-chain.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </RiderLayout>
  );
}
