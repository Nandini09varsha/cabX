import {
  IndianRupee,
  TrendingUp,
  Car,
  Route,
  CalendarDays,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";

function Earnings() {
  // Temporary mock data.
  // Later this will come from the backend.
  const earnings = {
    today: 745,
    thisWeek: 4280,
    thisMonth: 16850,
    totalRides: 5,
    totalDistance: 30.7,
    averageFare: 228,
  };

  const recentEarnings = [
    {
      id: 1,
      rider: "Rahul Sharma",
      route: "Vaishali Metro Station → Noida Sector 62",
      date: "31 Aug 2026",
      time: "10:30 AM",
      distance: "6.4 km",
      amount: 240,
    },
    {
      id: 2,
      rider: "Priya Singh",
      route: "Shipra Mall → Indirapuram Habitat Centre",
      date: "30 Aug 2026",
      time: "6:45 PM",
      distance: "4.1 km",
      amount: 175,
    },
    {
      id: 3,
      rider: "Aman Verma",
      route: "Kaushambi Metro → Anand Vihar",
      date: "30 Aug 2026",
      time: "2:15 PM",
      distance: "5.8 km",
      amount: 210,
    },
    {
      id: 4,
      rider: "Sneha Kapoor",
      route: "Akshardham Metro → Connaught Place",
      date: "29 Aug 2026",
      time: "8:20 PM",
      distance: "9.2 km",
      amount: 320,
    },
    {
      id: 5,
      rider: "Rohit Mehta",
      route: "Noida Sector 18 → Botanical Garden",
      date: "29 Aug 2026",
      time: "11:10 AM",
      distance: "5.2 km",
      amount: 195,
    },
  ];

  return (
    <DriverLayout activePage="Earnings">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518]">
              <TrendingUp size={17} className="text-black" />
            </div>

            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Driver Earnings
            </span>
          </div>

          <h1 className="text-2xl font-black sm:text-3xl">Earnings</h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your earnings and completed rides.
          </p>
        </div>

        {/* Main Earnings Card */}
        <div className="overflow-hidden rounded-2xl bg-[#111111] p-6 text-white shadow-sm dark:border dark:border-[#2A2A2A] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Earnings</p>

              <div className="mt-2 flex items-center gap-1">
                <IndianRupee size={30} className="text-[#F5C518]" />

                <span className="text-4xl font-black sm:text-5xl">
                  {earnings.thisMonth.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                <ArrowUpRight size={16} />

                <span>Earnings this month</span>
              </div>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5C518]">
              <TrendingUp size={30} className="text-black" />
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Today
                </p>

                <p className="mt-2 text-2xl font-black">₹{earnings.today}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <CalendarDays size={20} />
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This Week
                </p>

                <p className="mt-2 text-2xl font-black">₹{earnings.thisWeek}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          {/* Completed Rides */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completed Rides
                </p>

                <p className="mt-2 text-2xl font-black">
                  {earnings.totalRides}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <Car size={20} />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distance Driven
                </p>

                <p className="mt-2 text-2xl font-black">
                  {earnings.totalDistance} km
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <Route size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Earnings Overview</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your performance based on completed rides.
              </p>
            </div>

            <div className="rounded-xl bg-[#F5C518]/15 px-4 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Average Fare
              </p>

              <p className="mt-1 font-bold">₹{earnings.averageFare}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Monthly Earnings
              </p>

              <p className="mt-2 text-xl font-black">
                ₹{earnings.thisMonth.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Average / Ride
              </p>

              <p className="mt-2 text-xl font-black">₹{earnings.averageFare}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Earnings / KM
              </p>

              <p className="mt-2 text-xl font-black">
                ₹{(earnings.thisMonth / earnings.totalDistance).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Earnings */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold">Recent Earnings</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Earnings from your latest completed rides.
            </p>
          </div>

          <div className="space-y-3">
            {recentEarnings.map((ride) => (
              <div
                key={ride.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Ride Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5C518]">
                      <Car size={19} className="text-black" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{ride.rider}</p>

                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                          <CheckCircle size={11} />
                          Completed
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {ride.route}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span>{ride.date}</span>

                        <span>•</span>

                        <span>{ride.time}</span>

                        <span>•</span>

                        <span>{ride.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="shrink-0 sm:text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Earned
                    </p>

                    <p className="mt-1 text-xl font-black text-green-600 dark:text-green-400">
                      +₹{ride.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}

export default Earnings;
