import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  Star,
  Phone,
  MessageCircle,
  Clock,
  IndianRupee,
  Route,
  Play,
  CheckCircle,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";

function CurrentRide() {
  const [rideStatus, setRideStatus] = useState("ready");
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const savedRide = localStorage.getItem("cabx-current-ride");

    if (savedRide) {
      setRide(JSON.parse(savedRide));
    }
  }, []);

  if (!ride) {
    return (
      <DriverLayout activePage="Current Ride">
        <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C518]/20">
            <Navigation size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold">No Current Ride</h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            You don't have an active ride right now. Accept a ride request to
            start your journey.
          </p>

          <button
            onClick={() => (window.location.href = "/driver/requests")}
            className="mt-5 rounded-xl bg-[#F5C518] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#E5B600]"
          >
            View Ride Requests
          </button>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout activePage="Current Ride">
      <div className="space-y-6">
        {/* Page Heading */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">Current Ride</h1>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
              Ride Active
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your ongoing ride and rider details.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Ride Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Rider Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2A2A2A] dark:bg-[#111111]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] text-lg font-bold text-black">
                    {ride.rider.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{ride.rider}</h2>

                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Star size={14} className="fill-current text-[#F5C518]" />
                      <span>{ride.riderRating} Rating</span>
                    </div>
                  </div>
                </div>

                {/* Rider Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100 dark:border-[#2A2A2A] dark:hover:bg-[#1F1F1F]"
                    aria-label="Call rider"
                  >
                    <Phone size={18} />
                  </button>

                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100 dark:border-[#2A2A2A] dark:hover:bg-[#1F1F1F]"
                    aria-label="Message rider"
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Route Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2A2A2A] dark:bg-[#111111]">
              <div className="mb-6 flex items-center gap-2">
                <Route size={20} className="text-[#F5C518]" />

                <h2 className="text-lg font-bold">Ride Route</h2>
              </div>

              <div className="space-y-6">
                {/* Pickup */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                      <MapPin
                        size={19}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>

                    <div className="mt-2 h-10 border-l-2 border-dashed border-gray-300 dark:border-gray-700" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Pickup
                    </p>

                    <p className="mt-1 font-semibold">{ride.pickup}</p>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                    <Navigation
                      size={19}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Destination
                    </p>

                    <p className="mt-1 font-semibold">{ride.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Statistics */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Route size={17} />
                  <span className="text-sm">Distance</span>
                </div>

                <p className="mt-2 text-xl font-bold">{ride.distance}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock size={17} />
                  <span className="text-sm">Duration</span>
                </div>

                <p className="mt-2 text-xl font-bold">{ride.duration}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#111111]">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <IndianRupee size={17} />
                  <span className="text-sm">Fare</span>
                </div>

                <p className="mt-2 text-xl font-bold">₹{ride.fare}</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-[#2A2A2A] dark:bg-[#181818]">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518]">
                  <Navigation size={25} className="text-black" />
                </div>

                <p className="mt-3 font-semibold">Live Navigation</p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Map will be integrated here
                </p>
              </div>
            </div>

            {/* Ride Status */}
            {/* Ride Status */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2A2A2A] dark:bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]">
                  {rideStatus === "completed" ? (
                    <CheckCircle size={19} className="text-black" />
                  ) : (
                    <Navigation size={19} className="text-black" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">Ride Status</p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {rideStatus === "ready" && "Ready to start"}
                    {rideStatus === "in-progress" && "Ride in progress"}
                    {rideStatus === "completed" && "Ride completed"}
                  </p>
                </div>
              </div>

              {/* Ready */}
              {rideStatus === "ready" && (
                <button
                  onClick={() => setRideStatus("in-progress")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-5 py-3 font-bold text-black transition hover:bg-[#e5b800]"
                >
                  <Play size={18} />
                  Start Ride
                </button>
              )}

              {/* In Progress */}
              {rideStatus === "in-progress" && (
                <button
                  onClick={() => setRideStatus("completed")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-5 py-3 font-bold text-black transition hover:bg-[#e5b800]"
                >
                  <CheckCircle size={18} />
                  Complete Ride
                </button>
              )}

              {/* Completed */}
              {rideStatus === "completed" && (
                <div className="mt-6 rounded-xl bg-green-50 p-4 text-center dark:bg-green-950/30">
                  <CheckCircle
                    size={24}
                    className="mx-auto text-green-600 dark:text-green-400"
                  />

                  <p className="mt-2 font-semibold text-green-700 dark:text-green-400">
                    Ride Completed
                  </p>

                  <p className="mt-1 text-xs text-green-600 dark:text-green-500">
                    ₹{ride.fare} has been added to your earnings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}

export default CurrentRide;
