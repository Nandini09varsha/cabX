import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Navigation, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RiderLayout from "../../layouts/RiderLayout";
import WalletBar from "../../components/WalletBar";
import { rideTypes } from "../../data/riderMockData";
import { rideApi } from "../../api/cabx";
import { formatDate, formatFare } from "../../lib/format";

export default function RiderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [selected, setSelected] = useState("mini");
  const [rides, setRides] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    rideApi.mine().then((res) => setRides(res.data.rides || [])).catch(() => {});
    rideApi.active().then((res) => setActive(res.data.ride)).catch(() => {});
  }, []);

  return (
    <RiderLayout activePage="Dashboard">
      <div className="mb-7">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl font-black">
          Where are you going, {user?.name?.split(" ")[0] || "Rider"}?
        </h1>
      </div>
      <WalletBar />
      {active && (
        <button
          onClick={() => navigate("/rider/current-ride")}
          className="mb-6 w-full rounded-2xl border border-primary bg-accent-soft p-4 text-left"
        >
          <p className="text-sm font-semibold">Active ride · {active.status}</p>
          <p className="mt-1 font-bold">
            {active.source} → {active.destination}
          </p>
        </button>
      )}
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="overflow-hidden rounded-3xl border border-border bg-card ">
          <div className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Where to?</h2>
                <p className="text-sm text-muted-foreground">
                  Pickup stays manual while GPS is paused.
                </p>
              </div>
              <Navigation size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <MapPin size={18} className="text-primary" />
                <input className="w-full bg-transparent outline-none" value="Current location" readOnly />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border p-3 ">
                <Search size={18} />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            {destination && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {rideTypes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`rounded-xl border p-3 text-left ${
                      selected === r.id
                        ? "border-primary bg-accent-soft"
                        : "border-border"
                    }`}
                  >
                    <p className="font-bold">{r.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.eta} · ₹{r.fare}
                    </p>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/rider/book", { state: { destination, selected } })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground"
            >
              Book a ride <ArrowRight size={18} />
            </button>
          </div>
        </section>
        <section className="rounded-3xl border border-border bg-card p-6 ">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Recent rides</h2>
            <button onClick={() => navigate("/rider/history")} className="text-sm font-bold">
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {rides.slice(0, 4).map((r) => (
              <div key={r._id} className="rounded-2xl bg-muted/50 p-4">
                <p className="font-semibold">
                  {r.source} → {r.destination}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(r.createdAt)} · {r.status}
                </p>
                <p className="mt-2 font-bold">{formatFare(r.amount)}</p>
              </div>
            ))}
            {rides.length === 0 && (
              <p className="text-sm text-muted-foreground">No trips yet. Book a ride to get started.</p>
            )}
          </div>
        </section>
      </div>
    </RiderLayout>
  );
}
