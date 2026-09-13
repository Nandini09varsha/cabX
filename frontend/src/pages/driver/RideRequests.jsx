import { useEffect, useState } from "react";
import {
  Car,
  Clock3,
  MapPin,
  Navigation,
  Star,
  Wallet,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";

const API_URL = "http://localhost:5000/api";

function RideRequests() {
  const [requests, setRequests] = useState([]);
  const [rideAction, setRideAction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ride requests from backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("cabx-token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/driver/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch ride requests");
      }

      const formattedRequests = data.rides.map((ride) => ({
        id: ride._id,
        rider: ride.rider?.name || "Unknown Rider",
        phone: ride.rider?.phone || "",
        rating: 4.8,
        pickup: ride.pickup.address,
        destination: ride.destination.address,
        distance: "N/A",
        duration: "N/A",
        fare: ride.fare,
        requestedAt: "Just now",
        rideData: ride,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error("Fetch ride requests error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests when page loads
  useEffect(() => {
    const loadRequests = async () => {
      await fetchRequests();
    };

    loadRequests();
  }, []);

  // Accept ride
  const handleAccept = async (request) => {
    try {
      const token = localStorage.getItem("cabx-token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/driver/rides/${request.id}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept ride");
      }

      setRideAction({
        type: "accepted",
        ride: request,
      });

      // Store actual backend ride
      localStorage.setItem("cabx-current-ride", JSON.stringify(data.ride));

      // Remove accepted ride from available requests
      setRequests((prev) => prev.filter((ride) => ride.id !== request.id));
    } catch (error) {
      console.error("Accept ride error:", error);
      alert(error.message);
    }
  };

  // Reject ride
  const handleReject = async (request) => {
    try {
      const token = localStorage.getItem("cabx-token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/driver/rides/${request.id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject ride");
      }

      setRideAction({
        type: "rejected",
        ride: request,
      });

      // Remove rejected ride from UI
      setRequests((prev) => prev.filter((ride) => ride.id !== request.id));
    } catch (error) {
      console.error("Reject ride error:", error);
      alert(error.message);
    }
  };

  return (
    <DriverLayout activePage="Ride Requests">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              You're online
            </span>
          </div>

          <h1 className="text-2xl font-black sm:text-3xl">Ride Requests</h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a ride that works best for you.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-[#2A2A2A] dark:bg-[#171717] dark:hover:bg-[#202020]">
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>

      {/* Ride Action Status */}
      {rideAction && (
        <div
          className={`mb-6 rounded-2xl border p-5 ${
            rideAction.type === "accepted"
              ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
              : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${
                    rideAction.type === "accepted"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {rideAction.type === "accepted" ? (
                    <Check size={15} />
                  ) : (
                    <X size={15} />
                  )}
                </div>

                <p
                  className={`font-bold ${
                    rideAction.type === "accepted"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {rideAction.type === "accepted"
                    ? "Ride Accepted"
                    : "Ride Rejected"}
                </p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {rideAction.type === "accepted"
                  ? `Your ride with ${rideAction.ride.rider} is ready to begin.`
                  : `You rejected the ride request from ${rideAction.ride.rider}.`}
              </p>
            </div>

            {rideAction.type === "accepted" && (
              <button
                onClick={() => (window.location.href = "/driver/current-ride")}
                className="rounded-xl bg-[#F5C518] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#E5B600]"
              >
                View Current Ride
              </button>
            )}
          </div>
        </div>
      )}

      {/* Request Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">
          {requests.length} {requests.length === 1 ? "ride" : "rides"} available
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated just now
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#F5C518]" />

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Loading ride requests...
            </p>
          </div>
        </div>
      ) : requests.length > 0 ? (
        /* Requests */
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]"
            >
              {/* Top Section */}
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-[#2A2A2A] md:flex-row md:items-center md:justify-between">
                {/* Rider */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] text-lg font-black text-black">
                    {request.rider.charAt(0)}
                  </div>

                  <div>
                    <p className="font-bold">{request.rider}</p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Star size={12} className="fill-current text-[#F5C518]" />

                      <span>{request.rating}</span>

                      <span>•</span>

                      <span>{request.requestedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Fare */}
                <div className="md:text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Estimated fare
                  </p>

                  <p className="text-2xl font-black">₹{request.fare}</p>
                </div>
              </div>

              {/* Route */}
              <div className="p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  {/* Locations */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="h-3.5 w-3.5 rounded-full border-[3px] border-[#F5C518]" />

                      <div className="my-1 h-12 border-l border-dashed border-gray-300 dark:border-gray-600" />

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
                          {request.pickup}
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
                          {request.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-[300px]">
                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                      <MapPin
                        size={16}
                        className="mx-auto mb-1 text-gray-500"
                      />

                      <p className="text-[11px] text-gray-400">Distance</p>

                      <p className="mt-1 text-sm font-bold">
                        {request.distance}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E]">
                      <Clock3
                        size={16}
                        className="mx-auto mb-1 text-gray-500"
                      />

                      <p className="text-[11px] text-gray-400">Duration</p>

                      <p className="mt-1 text-sm font-bold">
                        {request.duration}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-gray-50 p-3 text-center dark:bg-[#1E1E1E] sm:col-span-1">
                      <Wallet
                        size={16}
                        className="mx-auto mb-1 text-gray-500"
                      />

                      <p className="text-[11px] text-gray-400">Fare</p>

                      <p className="mt-1 text-sm font-bold">₹{request.fare}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReject(request)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold transition hover:bg-gray-100 dark:border-[#3A3A3A] dark:hover:bg-[#222]"
                  >
                    <X size={17} />
                    Reject
                  </button>

                  <button
                    onClick={() => handleAccept(request)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#F5C518] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#E5B600]"
                  >
                    <Check size={17} />
                    Accept Ride
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-[#333] dark:bg-[#171717]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C518]/20">
            <Car size={28} />
          </div>

          <h2 className="text-xl font-bold">No ride requests right now</h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Stay online and we'll notify you as soon as a rider nearby requests
            a ride.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              fetchRequests();
            }}
            className="mt-5 rounded-xl bg-[#F5C518] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#E5B600]"
          >
            Refresh Requests
          </button>
        </div>
      )}
    </DriverLayout>
  );
}

export default RideRequests;
