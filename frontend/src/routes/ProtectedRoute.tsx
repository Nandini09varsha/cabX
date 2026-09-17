import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const homes = {
  rider: "/rider",
  driver: "/driver",
  admin: "/admin",
};

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] dark:bg-[#0B0B0B]">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-[#2A2A2A] dark:bg-[#171717]">
          Loading CabX...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={homes[user.role] || "/"} replace />;
  }

  return children;
}

export default ProtectedRoute;
