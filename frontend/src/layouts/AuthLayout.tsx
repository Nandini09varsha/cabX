import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink px-12 py-12 text-ink-foreground lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 42%), radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 46%)",
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
        <div className="relative z-10 mt-auto max-w-md pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            On-chain mobility
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
            Lock a fare. Ride with certainty.
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-foreground/75">
            CabX holds payment in Solana escrow until the trip is complete — for
            riders and drivers who want the fare settled in public, not in a
            black box.
          </p>
        </div>
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
