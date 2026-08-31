import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RiderDashboard from "./pages/rider/RiderDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import RideRequests from "./pages/driver/RideRequests";
import CurrentRide from "./pages/driver/CurrentRide";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RideHistory from "./pages/driver/RideHistory";
import Earnings from "./pages/driver/Earnings";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverSettings from "./pages/driver/DriverSettings";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rider */}
            <Route
              path="/rider"
              element={
                <ProtectedRoute role="rider">
                  <RiderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Driver */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute role="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/requests"
              element={
                <ProtectedRoute role="driver">
                  <RideRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/current-ride"
              element={
                <ProtectedRoute role="driver">
                  <CurrentRide />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/history"
              element={
                <ProtectedRoute role="driver">
                  <RideHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/earnings"
              element={
                <ProtectedRoute role="driver">
                  <Earnings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/profile"
              element={
                <ProtectedRoute role="driver">
                  <DriverProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver/settings"
              element={
                <ProtectedRoute role="driver">
                  <DriverSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
