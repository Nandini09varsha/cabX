import {
  Car,
  Map,
  Wallet,
  Star,
  TrendingUp,
  Navigation,
  Clock3, 
  Check,
  XCircle,
} from "lucide-react";

import LiveMap from "../../components/LiveMap";
import DriverLayout from "../../components/driver/DriverLayout";
import { useAuth } from "../../context/AuthContext";

function DriverDashboard() {
  const { user } = useAuth();

  // Temporary mock data.
  // We will replace this with real API data later.
  const stats = {
    earnings: 1240,
    rides: 8,
    rating: 4.8,
    acceptance: 92,
  };

  const rideRequest = {
    pickup: "Indirapuram Habitat Centre",
    destination: "Shipra Mall, Ghaziabad",
    distance: "4.2 km",
    estimatedTime: "18 min",
    fare: 185,
  };

  return (
    <DriverLayout activePage="Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back 👋
        </p>

        <h1 className="mt-1 text-2xl font-black sm:text-3xl">
          Ready to drive, {user?.name?.split(" ")[0] || "Driver"}?
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {/* Earnings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]/20">
              <Wallet
                size={20}
                className="text-[#C9A000] dark:text-[#F5C518]"
              />
            </div>

            <TrendingUp size={18} className="text-green-500" />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Today's Earnings
          </p>

          <p className="mt-1 text-2xl font-black">₹{stats.earnings}</p>
        </div>

        {/* Rides */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
            <Car size={20} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Today's Rides
          </p>

          <p className="mt-1 text-2xl font-black">{stats.rides}</p>
        </div>

        {/* Rating */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
            <Star size={20} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Driver Rating
          </p>

          <p className="mt-1 text-2xl font-black">{stats.rating} ⭐</p>
        </div>

        {/* Acceptance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/30">
            <Check size={20} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acceptance Rate
          </p>

          <p className="mt-1 text-2xl font-black">{stats.acceptance}%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#2A2A2A]">
            <div>
              <h2 className="font-bold">Your Location</h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live driver location
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              GPS Active
            </div>
          </div>

          <div className="h-[380px]">
            <LiveMap />
          </div>
        </div>

        {/* Ride Request */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#2A2A2A]">
            <div>
              <h2 className="font-bold">New Ride Request</h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Just now
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C518]">
              <Navigation size={17} className="text-black" />
            </div>
          </div>

          <div className="p-5">
            {/* Rider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-bold dark:bg-[#2A2A2A]">
                A
              </div>

              <div>
                <p className="font-semibold">Ananya Sharma</p>

                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Star size={12} className="fill-current" />
                  4.9 Rider
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="mb-5 rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-3 w-3 rounded-full border-[3px] border-[#F5C518]" />

                  <div className="my-1 h-10 border-l border-dashed border-gray-300 dark:border-gray-600" />

                  <div className="h-3 w-3 rounded-sm bg-black dark:bg-white" />
                </div>

                <div className="flex-1 space-y-5">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {rideRequest.pickup}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Destination
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {rideRequest.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className="mb-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                <Map size={16} className="mx-auto mb-1" />

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Distance
                </p>

                <p className="mt-1 text-sm font-bold">{rideRequest.distance}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                <Clock3 size={16} className="mx-auto mb-1" />

                <p className="text-xs text-gray-500 dark:text-gray-400">ETA</p>

                <p className="mt-1 text-sm font-bold">
                  {rideRequest.estimatedTime}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                <Wallet size={16} className="mx-auto mb-1" />

                <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>

                <p className="mt-1 text-sm font-bold">₹{rideRequest.fare}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold transition hover:bg-gray-100 dark:border-[#3A3A3A] dark:hover:bg-[#222]">
                <XCircle size={17} />
                Reject
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#E5B600]">
                <Check size={17} />
                Accept Ride
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Reminder */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Keep your profile updated</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Complete your vehicle and license information to receive more ride
              requests.
            </p>
          </div>

          <button className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-[#F5C518] dark:text-black dark:hover:bg-[#E5B600]">
            Complete Profile
          </button>
        </div>
      </div>
    </DriverLayout>
  );
}

export default DriverDashboard;
