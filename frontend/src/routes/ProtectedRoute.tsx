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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border border-border bg-card px-6 py-4 ">
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
