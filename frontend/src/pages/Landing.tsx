import { ArrowRight, ShieldCheck, Zap, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LiveMap from "../components/LiveMap";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-muted-foreground">The smarter way to move</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your ride.
              <br />
              <span className="text-primary">Your way.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              CabX connects riders and drivers with on-chain escrow. Lock a fare, accept a ride, then settle when the trip completes.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a ride
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
              </Link>
              <Link
                to="/register"
                className="flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-7 py-4 font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Become a driver
              </Link>
            </div>
          </div>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-muted p-6 shadow-[0_24px_60px_rgba(28,25,20,0.12)] sm:p-8">
            <LiveMap />
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          <Stat value="24/7" label="Available" />
          <Stat value="Fast" label="Driver matching" />
          <Stat value="Secure" label="Transactions" />
          <Stat value="Web3" label="Powered rides" />
        </div>
      </section>
      <section id="features" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Why CabX</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Built for the way rides should work.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={<Zap />} title="Fast" description="Get matched with nearby drivers quickly and get where you need to go." />
          <FeatureCard icon={<ShieldCheck />} title="Secure" description="Built with authentication, verified users and transparent transactions." />
          <FeatureCard icon={<MapPin />} title="Real-time" description="Track your driver and ride progress with live location updates." />
          <FeatureCard icon={<Wallet />} title="Decentralized" description="Blockchain-powered settlement gives riders and drivers greater transparency." />
        </div>
      </section>
      <section id="how-it-works" className="scroll-mt-24 border-y border-border bg-muted px-6 py-24 text-foreground">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            From pickup to destination in three simple steps.
          </h2>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Step number="01" title="Choose your destination" description="Enter your pickup point and destination to see available ride options." />
            <Step number="02" title="Get matched" description="CabX finds a nearby driver and connects you in real time." />
            <Step number="03" title="Ride & pay" description="Lock the fare in Solana escrow, then a driver accepts and completes the trip on-chain." />
          </div>
        </div>
      </section>
      <section className="bg-background px-6 py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card px-8 py-16 text-center sm:px-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Ready to move?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Join CabX and experience a smarter, more transparent way to ride.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-xl font-extrabold text-foreground">
            Cab<span className="text-primary">X</span>
          </p>
          <p className="text-sm text-muted-foreground">Decentralized mobility, reimagined.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="p-7 text-center">
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7 transition-transform hover:-translate-y-1 motion-reduce:transform-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">{icon}</div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <p className="text-5xl font-extrabold text-primary">{number}</p>
      <h3 className="mt-5 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 max-w-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

export default Landing;
