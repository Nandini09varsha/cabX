import { useEffect, useState } from "react";
import { Car, CheckCircle, Clock3, MapPin, Navigation, Route } from "lucide-react";
import DriverLayout from "../../components/driver/DriverLayout";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { rideApi } from "../../api/cabx";
import { formatDate, formatFare, initials, apiError } from "../../lib/format";

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    rideApi
      .mine()
      .then((res) => setRides(res.data.rides || []))
      .catch((err) => setError(apiError(err)));
  }, []);

  const completed = rides.filter((ride) => ride.status === "completed");
  const totalEarnings = completed.reduce((sum, ride) => sum + Number(ride.amount || 0), 0);
  const totalDistance = rides.reduce((sum, ride) => sum + Number(ride.distanceKm || 0), 0);

  return (
    <DriverLayout activePage="Ride History">
      <h1 className="text-2xl font-black sm:text-3xl">Ride History</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Your assigned trips from the CabX program.</p>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-sm text-muted-foreground">Total rides</p>
          <p className="mt-2 text-2xl font-black">{rides.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <p className="text-sm text-muted-foreground">Completed earnings</p>
          <p className="mt-2 text-2xl font-black">{formatFare(totalEarnings)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 ">
          <Route size={21} />
          <p className="mt-2 text-2xl font-black">{totalDistance.toFixed(1)} km</p>
        </div>
      </div>
      {rides.length === 0 ? (
        <EmptyState icon={Car} title="No assigned rides yet" text="Accepted rides will show up here." />
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="overflow-hidden rounded-2xl border border-border bg-card "
            >
              <div className="flex flex-col gap-4 border-b border-border p-5  sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-black">
                    {initials(ride.rider?.name)}
                  </div>
                  <div>
                    <p className="font-bold">{ride.rider?.name || "Rider"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(ride.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={ride.status} />
                  <p className="text-xl font-black">{formatFare(ride.amount)}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin size={14} /> {ride.source}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm">
                  <Navigation size={14} /> {ride.destination}
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 size={12} /> {ride.durationMin || "—"} min
                  {ride.status === "completed" && (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                      <CheckCircle size={12} /> Paid
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DriverLayout>
  );
}

export default RideHistory;
