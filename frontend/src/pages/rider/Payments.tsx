import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import RiderLayout from "../../layouts/RiderLayout";
import WalletBar from "../../components/WalletBar";
import EmptyState from "../../components/EmptyState";
import { miscApi } from "../../api/cabx";
import { formatDate, formatFare, apiError } from "../../lib/format";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    miscApi
      .payments()
      .then((res) => setPayments(res.data.payments || []))
      .catch((err) => setError(apiError(err)));
  }, []);

  return (
    <RiderLayout activePage="Payments">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escrow locks, refunds, and releases from the CabX program.
        </p>
      </div>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <section className="rounded-3xl border border-border bg-card p-6 ">
        <h2 className="font-bold">On-chain payment history</h2>
        {payments.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={Wallet} title="No payments yet" text="Ride escrow activity will appear here." />
          </div>
        ) : (
          payments.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between border-b border-border py-4 last:border-0 "
            >
              <div>
                <b className="text-sm capitalize">{p.kind.replace("_", " ")}</b>
                <p className="text-xs text-muted-foreground">
                  {formatDate(p.createdAt)} · {p.ride?.source || "Wallet"} → {p.ride?.destination || "—"}
                </p>
                {p.signature && (
                  <p className="mt-1 max-w-xs truncate text-[11px] text-muted-foreground">{p.signature}</p>
                )}
              </div>
              <div className="text-right">
                <b>{formatFare(p.amount)}</b>
                <p className="text-xs text-green-600">Recorded</p>
              </div>
            </div>
          ))
        )}
      </section>
    </RiderLayout>
  );
}
