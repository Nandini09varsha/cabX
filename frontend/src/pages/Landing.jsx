import { ArrowRight, ShieldCheck, Zap, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LiveMap from "../components/LiveMap";

function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#222222] dark:bg-[#0B0B0B] dark:text-white">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Hero Text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 dark:border-[#2A2A2A] dark:bg-[#171717]">
              <span className="h-2 w-2 rounded-full bg-[#F5C518]" />

              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                The smarter way to move
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-[#0B0B0B] dark:text-white sm:text-6xl lg:text-7xl">
              Your ride.
              <br />
              <span className="text-[#F5C518]">Your way.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              CabX connects riders and drivers through a secure, transparent and
              decentralized ride-hailing experience.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 rounded-full bg-[#0B0B0B] px-7 py-4 font-semibold text-white transition hover:bg-[#F5C518] hover:text-black dark:bg-[#F5C518] dark:text-black dark:hover:bg-white"
              >
                Book a ride
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/register"
                className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-7 py-4 font-semibold text-[#0B0B0B] transition hover:border-[#F5C518] dark:border-[#333333] dark:bg-[#171717] dark:text-white"
              >
                Become a driver
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0B0B0B] p-6 shadow-2xl sm:p-8">
              <LiveMap />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#111111]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 dark:divide-[#2A2A2A] md:grid-cols-4">
          <div className="p-7 text-center">
            <p className="text-3xl font-black text-[#0B0B0B] dark:text-white">
              24/7
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Available
            </p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-black text-[#0B0B0B] dark:text-white">
              Fast
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Driver matching
            </p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-black text-[#0B0B0B] dark:text-white">
              Secure
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Transactions
            </p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-black text-[#0B0B0B] dark:text-white">
              Web3
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Powered rides
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#F5C518]">
            Why CabX
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0B0B0B] dark:text-white sm:text-5xl">
            Built for the way rides should work.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Zap />}
            title="Fast"
            description="Get matched with nearby drivers quickly and get where you need to go."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure"
            description="Built with authentication, verified users and transparent transactions."
          />

          <FeatureCard
            icon={<MapPin />}
            title="Real-time"
            description="Track your driver and ride progress with live location updates."
          />

          <FeatureCard
            icon={<Wallet />}
            title="Decentralized"
            description="Blockchain-powered settlement gives riders and drivers greater transparency."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#0B0B0B] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#F5C518]">
            How it works
          </p>

          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            From pickup to destination in three simple steps.
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <Step
              number="01"
              title="Choose your destination"
              description="Enter your pickup point and destination to see available ride options."
            />

            <Step
              number="02"
              title="Get matched"
              description="CabX finds a nearby driver and connects you in real time."
            />

            <Step
              number="03"
              title="Ride & pay"
              description="Complete your ride and settle the payment securely."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F7F5] px-6 py-24 dark:bg-[#0B0B0B]">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#F5C518] px-8 py-16 text-center sm:px-16">
          <h2 className="text-4xl font-black tracking-tight text-[#0B0B0B] sm:text-5xl">
            Ready to move?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg text-[#0B0B0B]/70">
            Join CabX and experience a smarter, more transparent way to ride.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0B0B0B] px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Get started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#111111]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-xl font-black text-[#0B0B0B] dark:text-white">
            Cab<span className="text-[#F5C518]">X</span>
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Decentralized mobility, reimagined.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-[#2A2A2A] dark:bg-[#171717]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5C518] text-[#0B0B0B]">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#0B0B0B] dark:text-white">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div>
      <p className="text-5xl font-black text-[#F5C518]">{number}</p>

      <h3 className="mt-5 text-2xl font-bold">{title}</h3>

      <p className="mt-3 max-w-sm leading-7 text-gray-400">{description}</p>
    </div>
  );
}

export default Landing;
