import {
  Car,
  CheckCircle,
  Clock3,
  MapPin,
  Navigation,
  IndianRupee,
  Route,
  Star,
  CalendarDays,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";

function RideHistory() {
  // Temporary mock data.
  // Later this will come from the backend.
  const rides = [
    {
      id: 1,
      rider: "Rahul Sharma",
      rating: 4.8,
      pickup: "Vaishali Metro Station",
      destination: "Noida Sector 62",
      distance: "6.4 km",
      duration: "24 min",
      fare: 240,
      date: "31 Aug 2026",
      time: "10:30 AM",
    },
    {
      id: 2,
      rider: "Priya Singh",
      rating: 4.9,
      pickup: "Shipra Mall",
      destination: "Indirapuram Habitat Centre",
      distance: "4.1 km",
      duration: "17 min",
      fare: 175,
      date: "30 Aug 2026",
      time: "6:45 PM",
    },
    {
      id: 3,
      rider: "Aman Verma",
      rating: 4.7,
      pickup: "Kaushambi Metro",
      destination: "Anand Vihar",
      distance: "5.8 km",
      duration: "21 min",
      fare: 210,
      date: "30 Aug 2026",
      time: "2:15 PM",
    },
    {
      id: 4,
      rider: "Sneha Kapoor",
      rating: 4.9,
      pickup: "Akshardham Metro",
      destination: "Connaught Place",
      distance: "9.2 km",
      duration: "31 min",
      fare: 320,
      date: "29 Aug 2026",
      time: "8:20 PM",
    },
    {
      id: 5,
      rider: "Rohit Mehta",
      rating: 4.6,
      pickup: "Noida Sector 18",
      destination: "Botanical Garden",
      distance: "5.2 km",
      duration: "19 min",
      fare: 195,
      date: "29 Aug 2026",
      time: "11:10 AM",
    },
  ];

  const totalEarnings = rides.reduce((total, ride) => total + ride.fare, 0);

  const totalDistance = rides.reduce(
    (total, ride) => total + parseFloat(ride.distance),
    0,
  );

  return (
    <DriverLayout activePage="Ride History">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518]">
              <HistoryIcon />
            </div>

            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Completed Rides
            </span>
          </div>

          <h1 className="text-2xl font-black sm:text-3xl">Ride History</h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View your completed rides and earnings.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Rides */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Rides
                </p>

                <p className="mt-2 text-2xl font-black">{rides.length}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <Car size={21} />
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Earnings
                </p>

                <p className="mt-2 text-2xl font-black">₹{totalEarnings}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <IndianRupee size={21} />
              </div>
            </div>
          </div>

          {/* Total Distance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#2A2A2A] dark:bg-[#171717]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Distance
                </p>

                <p className="mt-2 text-2xl font-black">
                  {totalDistance.toFixed(1)} km
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/20">
                <Route size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* History Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Recent Rides</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your latest completed trips.
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {rides.length} Completed
          </span>
        </div>

        {/* Ride List */}
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]"
            >
              {/* Ride Top */}
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-[#2A2A2A] sm:flex-row sm:items-center sm:justify-between">
                {/* Rider */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] text-lg font-black text-black">
                    {ride.rider.charAt(0)}
                  </div>

                  <div>
                    <p className="font-bold">{ride.rider}</p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Star size={12} className="fill-current text-[#F5C518]" />

                      <span>{ride.rating}</span>

                      <span>•</span>

                      <CalendarDays size={12} />

                      <span>{ride.date}</span>

                      <span>•</span>

                      <span>{ride.time}</span>
                    </div>
                  </div>
                </div>

                {/* Completed + Fare */}
                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    <CheckCircle size={14} />
                    Completed
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Earned
                    </p>

                    <p className="text-xl font-black">₹{ride.fare}</p>
                  </div>
                </div>
              </div>

              {/* Route + Details */}
              <div className="p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  {/* Route */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="h-3.5 w-3.5 rounded-full border-[3px] border-[#F5C518]" />

                      <div className="my-1 h-10 border-l border-dashed border-gray-300 dark:border-gray-600" />

                      <div className="h-3.5 w-3.5 rounded-sm bg-black dark:bg-white" />
                    </div>

                    <div className="flex-1 space-y-5">
                      {/* Pickup */}
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            className="text-[#C9A000] dark:text-[#F5C518]"
                          />

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Pickup
                          </p>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {ride.pickup}
                        </p>
                      </div>

                      {/* Destination */}
                      <div>
                        <div className="flex items-center gap-2">
                          <Navigation size={14} />

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Destination
                          </p>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {ride.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-[300px]">
                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                      <Route size={16} className="mx-auto mb-1 text-gray-500" />

                      <p className="text-[11px] text-gray-400">Distance</p>

                      <p className="mt-1 text-sm font-bold">{ride.distance}</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                      <Clock3
                        size={16}
                        className="mx-auto mb-1 text-gray-500"
                      />

                      <p className="text-[11px] text-gray-400">Duration</p>

                      <p className="mt-1 text-sm font-bold">{ride.duration}</p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E] sm:col-span-1">
                      <IndianRupee
                        size={16}
                        className="mx-auto mb-1 text-gray-500"
                      />

                      <p className="text-[11px] text-gray-400">Earned</p>

                      <p className="mt-1 text-sm font-bold">₹{ride.fare}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DriverLayout>
  );
}

/*
  Small reusable icon component for the page heading.
*/
function HistoryIcon() {
  return <Clock3 size={17} className="text-black" />;
}

export default RideHistory;
