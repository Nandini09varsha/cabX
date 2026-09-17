import { Link } from "react-router-dom";
import { Lock, Navigation, Wallet } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const highlights = [
  {
    icon: Lock,
    title: "Lock the fare",
    copy: "Payment sits in Solana escrow before the trip starts.",
  },
  {
    icon: Navigation,
    title: "Ride in public view",
    copy: "Pickup, match, and trip status stay visible to both sides.",
  },
  {
    icon: Wallet,
    title: "Settle on completion",
    copy: "The driver is paid when the trip completes on-chain.",
  },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border bg-muted px-12 py-12 text-foreground lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 42%)",
          }}
        />
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
            C
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Cab<span className="text-primary">X</span>
          </span>
        </Link>

        <div className="relative z-10 mx-auto my-auto w-full max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            On-chain mobility
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
            Lock a fare. Ride with certainty.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            CabX holds payment in Solana escrow until the trip is complete — for
            riders and drivers who want the fare settled in public, not in a
            black box.
          </p>

          <ul className="mt-10 space-y-3">
            {highlights.map(({ icon: Icon, title: itemTitle, copy }) => (
              <li
                key={itemTitle}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{itemTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-8 text-sm text-muted-foreground">
          Escrow first. Settlement last. No hidden fare box.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 py-4 lg:justify-end lg:px-8">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
              C
            </span>
            <span className="text-xl font-extrabold">
              Cab<span className="text-primary">X</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_18px_50px_rgba(28,25,20,0.06)]">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {subtitle}
              </p>
            )}
            <div className="mt-6">{children}</div>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
