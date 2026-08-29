import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RiderDashboard from "./pages/rider/RiderDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/rider" element={<RiderDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
