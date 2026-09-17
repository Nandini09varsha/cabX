import { useEffect, useState } from "react";
import { ArrowRight, Car, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import RiderLayout from "../../layouts/RiderLayout";
import EmptyState from "../../components/EmptyState";
import { rideApi } from "../../api/cabx";
import { formatDate, formatFare, apiError } from "../../lib/format";

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    rideApi
      .mine()
      .then((res) => setRides(res.data.rides || []))
      .catch((err) => setError(apiError(err)));
  }, []);

  const completed = rides.filter((r) => r.status === "completed");
  const total = completed.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <RiderLayout activePage="Ride History">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Ride History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every trip stored off-chain and settled on-chain.</p>
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-sm text-muted-foreground">Total rides</p>
          <b className="mt-1 block text-2xl">{rides.length}</b>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-sm text-muted-foreground">Completed</p>
          <b className="mt-1 block text-2xl">{completed.length}</b>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-sm text-muted-foreground">Total spent</p>
          <b className="mt-1 block text-2xl">{formatFare(total)}</b>
        </div>
      </div>
      {rides.length === 0 ? (
        <EmptyState icon={Car} title="No rides yet" text="Book your first CabX ride to see it here." />
      ) : (
        <div className="space-y-3">
          {rides.map((r) => (
            <Link
              to={`/rider/history/${r._id}`}
              key={r._id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary "
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <Car size={19} />
                </div>
                <div>
                  <b>
                    {r.source} → {r.destination}
                  </b>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(r.createdAt)} · {r.distanceKm || "—"} km
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <b>{formatFare(r.amount)}</b>
                  <p
                    className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                      r.status === "completed" ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {r.status === "completed" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {r.status}
                  </p>
                </div>
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </RiderLayout>
  );
}
