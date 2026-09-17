import { useEffect, useState } from "react";
import { Car, TrendingUp } from "lucide-react";
import DriverLayout from "../../components/driver/DriverLayout";
import EmptyState from "../../components/EmptyState";
import { driverApi } from "../../api/cabx";
import { formatDate, formatFare, apiError } from "../../lib/format";

function Earnings() {
  const [data, setData] = useState({ total: 0, completedRides: 0, payments: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    driverApi
      .earnings()
      .then((res) => setData(res.data))
      .catch((err) => setError(apiError(err)));
  }, []);

  return (
    <DriverLayout activePage="Earnings">
      <h1 className="text-2xl font-black sm:text-3xl">Earnings</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Escrow releases paid to your token account.</p>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="mb-6 overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
        <p className="text-sm text-ink-foreground/65">Total released</p>
        <p className="mt-2 text-4xl font-black text-primary">{formatFare(data.total)}</p>
        <p className="mt-2 text-sm text-ink-foreground/65">{data.completedRides} completed rides</p>
      </div>
      {data.payments?.length ? (
        <div className="space-y-3">
          {data.payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-2xl border border-border bg-card p-5 "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold capitalize">{payment.kind.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
                </div>
                <p className="text-xl font-black text-green-600">+{formatFare(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={TrendingUp} title="No earnings yet" text="Complete a ride to release escrow to your wallet." />
      )}
    </DriverLayout>
  );
}

export default Earnings;
