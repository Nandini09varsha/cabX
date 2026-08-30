import { useState } from "react";
import {
  Car,
  LayoutDashboard,
  Map,
  History,
  Wallet,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Star,
  TrendingUp,
  Navigation,
  Clock3,
  Check,
  XCircle,
} from "lucide-react";

import LiveMap from "../../components/LiveMap";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function DriverDashboard() {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Temporary mock data.
  // We will replace this with API data later.
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

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "Ride Requests",
      icon: Car,
      badge: 2,
    },
    {
      label: "Current Ride",
      icon: Navigation,
    },
    {
      label: "Ride History",
      icon: History,
    },
    {
      label: "Earnings",
      icon: Wallet,
    },
    {
      label: "Profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0B] dark:bg-[#0B0B0B] dark:text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-[#2A2A2A] dark:bg-[#111111]/95 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#222]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518]">
            <Car size={18} className="text-black" />
          </div>

          <span className="text-xl font-black tracking-tight">CABX</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#222]">
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F5C518]" />
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-[#2A2A2A] dark:bg-[#111111] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]">
              <Car size={22} className="text-black" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">CABX</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Driver Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#222] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Driver Info */}
        <div className="border-b border-gray-200 p-5 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {user?.name || "CabX Driver"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Star size={12} className="fill-current" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-[#F5C518] text-black"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1F1F1F]"
                }`}
              >
                <Icon size={19} />

                <span className="flex-1 text-left">{item.label}</span>

                {item.badge && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                      item.active
                        ? "bg-black text-white"
                        : "bg-[#F5C518] text-black"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-4 dark:border-[#2A2A2A]">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 dark:bg-[#1B1B1B]">
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />

              <span className="text-sm font-medium">
                {isOnline ? "You're Online" : "You're Offline"}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        {/* Desktop Header */}
        <header className="hidden h-20 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-[#2A2A2A] dark:bg-[#111111] lg:flex">
          <div>
            <h2 className="text-xl font-bold">Driver Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your rides and earnings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl p-2.5 transition hover:bg-gray-100 dark:hover:bg-[#1F1F1F]">
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F5C518]" />
            </button>

            <ThemeToggle />

            <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-[#2A2A2A]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">
                {user?.name?.charAt(0)?.toUpperCase() || "D"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user?.name || "Driver"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Driver
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {/* Welcome + Online Toggle */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back 👋
              </p>

              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                Ready to drive, {user?.name?.split(" ")[0] || "Driver"}?
              </h1>
            </div>

            <button
              onClick={() => setIsOnline((prev) => !prev)}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition ${
                isOnline
                  ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
                  : "border-gray-200 bg-white dark:border-[#333] dark:bg-[#171717]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />

                <div className="text-left">
                  <p className="text-sm font-bold">
                    {isOnline ? "Online" : "Offline"}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isOnline
                      ? "You're accepting rides"
                      : "You're not accepting rides"}
                  </p>
                </div>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition ${
                  isOnline ? "bg-[#F5C518]" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    isOnline ? "left-6" : "left-1"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
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

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <Car size={20} />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Today's Rides
              </p>

              <p className="mt-1 text-2xl font-black">{stats.rides}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
                <Star size={20} />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Driver Rating
              </p>

              <p className="mt-1 text-2xl font-black">{stats.rating} ⭐</p>
            </div>

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
                  <Bell size={17} className="text-black" />
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
                    <p className="mt-1 text-sm font-bold">
                      {rideRequest.distance}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                    <Clock3 size={16} className="mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ETA
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {rideRequest.estimatedTime}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                    <Wallet size={16} className="mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fare
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      ₹{rideRequest.fare}
                    </p>
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

          {/* Quick Information */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">Keep your profile updated</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Complete your vehicle and license information to receive more
                  ride requests.
                </p>
              </div>

              <button className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-[#F5C518] dark:text-black dark:hover:bg-[#E5B600]">
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;
