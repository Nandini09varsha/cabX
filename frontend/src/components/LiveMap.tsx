import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LiveMap() {
  // Temporary CabX locations
  // We'll replace these with real locations later.
  const pickup = [28.6139, 77.209];
  const destination = [28.5355, 77.391];

  const drivers = [
    [28.612, 77.215],
    [28.605, 77.195],
    [28.625, 77.218],
  ];

  return (
    <div className="relative h-[430px] overflow-hidden rounded-2xl">
      <MapContainer
        center={pickup}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup */}
        <Marker position={pickup}>
          <Popup>
            <strong>Pickup location</strong>
          </Popup>
        </Marker>

        {/* Destination */}
        <Marker position={destination}>
          <Popup>
            <strong>Destination</strong>
          </Popup>
        </Marker>

        {/* Nearby drivers */}
        {drivers.map((driver, index) => (
          <Marker key={index} position={driver}>
            <Popup>
              <strong>CabX Driver</strong>
              <br />
              Available
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Ride Card */}
      <div className="absolute bottom-5 left-5 right-5 z-[1000] rounded-2xl bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Estimated fare</p>

            <p className="mt-1 text-2xl font-black text-foreground">₹248</p>
          </div>

          <div className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            4 min away
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMap;
