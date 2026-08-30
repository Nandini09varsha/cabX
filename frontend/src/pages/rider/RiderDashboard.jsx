import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

// ---- MOCK DATA ----
// Placeholder only. Once the Ride model + /api/rides endpoints exist, replace
// these with real state fetched from the backend. Kept local/unwired on
// purpose for this pass — see chat for scope.
const RIDE_TYPES = [
  { id: "auto", label: "Auto", eta: "3 min", fare: "₹85" },
  { id: "mini", label: "Mini", eta: "5 min", fare: "₹142" },
  { id: "sedan", label: "Sedan", eta: "6 min", fare: "₹198" },
];

const MOCK_RECENT_RIDES = [
  { id: 1, date: "Aug 27", route: "Hazratganj → Gomti Nagar", fare: "₹156", status: "Completed" },
  { id: 2, date: "Aug 24", route: "Alambagh → Charbagh", fare: "₹98", status: "Completed" },
];
// ---- END MOCK DATA ----

function RiderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("Current location");
  const [destination, setDestination] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [activeRide, setActiveRide] = useState(null); // mock "in progress" ride, null = none
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRequestRide = () => {
    if (!destination || !selectedType) return;
    // MOCK ONLY — no backend call yet. Real version will POST /api/rides.
    setActiveRide({
      pickup,
      destination,
      type: RIDE_TYPES.find((t) => t.id === selectedType),
      status: "Driver arriving",
    });
    setDestination("");
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#0B0B0B]">
      {/* Top bar: brand + profile avatar (not full profile — matches industry pattern) */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-[#2A2A2A]">
        <span className="text-xl font-black text-[#0B0B0B] dark:text-white">CabX</span>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] font-bold text-white dark:bg-[#F5C518] dark:text-black"
          >
            {user?.name?.[0]?.toUpperCase() || "R"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#2A2A2A] dark:bg-[#171717]">
              <p className="font-semibold text-[#0B0B0B] dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.phone}</p>
              <Button onClick={handleLogout} className="mt-3 w-auto bg-transparent px-4 py-1.5 text-sm text-[#0B0B0B] ring-1 ring-gray-300 hover:bg-gray-100 dark:text-white dark:ring-[#333333] dark:hover:bg-[#0B0B0B]">
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Map placeholder — real map/geolocation integration is a separate, bigger task */}
        <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-gray-400 dark:border-[#333333] dark:bg-[#171717]">
          Map goes here (Google Maps / Mapbox — future integration)
        </div>

        {/* "Where to?" — the primary action, front and center like Uber/Ola */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <h2 className="mb-4 text-lg font-bold text-[#0B0B0B] dark:text-white">Where to?</h2>

          <Input label="Pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} />
          <Input
            label="Destination"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {destination && (
            <div className="mt-2 space-y-2">
              {RIDE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    selectedType === type.id
                      ? "border-[#F5C518] bg-[#FFF9E5] dark:bg-[#2A2410]"
                      : "border-gray-200 dark:border-[#2A2A2A]"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-[#0B0B0B] dark:text-white">{type.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{type.eta} away</p>
                  </div>
                  <span className="font-semibold text-[#0B0B0B] dark:text-white">{type.fare}</span>
                </button>
              ))}

              <Button onClick={handleRequestRide} disabled={!selectedType} className="mt-2">
                Request ride
              </Button>
            </div>
          )}
        </div>

        {/* Active ride — only shown when a ride is in progress */}
        {activeRide && (
          <div className="mt-6 rounded-2xl border border-[#F5C518] bg-[#FFF9E5] p-6 dark:bg-[#2A2410]">
            <h2 className="mb-2 text-lg font-bold text-[#0B0B0B] dark:text-white">
              {activeRide.status}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {activeRide.pickup} → {activeRide.destination}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0B0B0B] dark:text-white">
              {activeRide.type.label} · {activeRide.type.fare}
            </p>
          </div>
        )}

        {/* Recent rides */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <h2 className="mb-4 text-lg font-bold text-[#0B0B0B] dark:text-white">Recent rides</h2>

          <div className="space-y-3">
            {MOCK_RECENT_RIDES.map((ride) => (
              <div key={ride.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-[#2A2A2A]">
                <div>
                  <p className="font-medium text-[#0B0B0B] dark:text-white">{ride.route}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ride.date} · {ride.status}</p>
                </div>
                <span className="font-semibold text-[#0B0B0B] dark:text-white">{ride.fare}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiderDashboard;