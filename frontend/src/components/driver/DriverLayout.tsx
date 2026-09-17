import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Car,
  LayoutDashboard,
  History,
  Wallet,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Star,
  Navigation,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { driverApi } from "../../api/cabx";

function DriverLayout({ children, activePage = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [rating, setRating] = useState(user?.rating || 0);

  useEffect(() => {
    driverApi
      .me()
      .then((res) => {
        setIsOnline(Boolean(res.data.driver?.online));
        setRating(res.data.user?.rating || res.data.driver?.ratings || 0);
      })
      .catch(() => {});
  }, []);

  const navigationItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/driver" },
    { label: "Ride Requests", icon: Car, path: "/driver/requests" },
    { label: "Current Ride", icon: Navigation, path: "/driver/current-ride" },
    { label: "Ride History", icon: History, path: "/driver/history" },
    { label: "Earnings", icon: Wallet, path: "/driver/earnings" },
    { label: "Stake", icon: ShieldCheck, path: "/driver/register" },
    { label: "Profile", icon: UserRound, path: "/driver/profile" },
    { label: "Settings", icon: Settings, path: "/driver/settings" },
  ];

  const toggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    try {
      await driverApi.availability(next);
    } catch {
      setIsOnline(!next);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 transition hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Car size={18} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight">CABX</span>
        </div>
        <ThemeToggle />
      </header>

      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-card transition-transform duration-300  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-6 ">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Car size={22} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">CABX</h1>
              <p className="text-xs text-muted-foreground">Driver Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-border p-5 ">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.name || "CabX Driver"}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star size={12} className="fill-current" />
                <span>{Number(rating || 0).toFixed(1)} Rating</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.label || location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={19} />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 ">
          <button
            onClick={toggleOnline}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3 dark:bg-muted"
          >
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium">
                {isOnline ? "You're Online" : "You're Offline"}
              </span>
            </div>
            <div
              className={`relative h-5 w-9 rounded-full transition ${
                isOnline ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 h-3 w-3 rounded-full bg-card shadow transition ${
                  isOnline ? "left-5" : "left-1"
                }`}
              />
            </div>
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-50 hidden h-20 items-center justify-between border-b border-border bg-card px-8  lg:flex">
          <div>
            <h2 className="text-xl font-bold">{activePage}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your CabX driver account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="ml-2 flex items-center gap-3 border-l border-border pl-4 ">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || "Driver"}</p>
                <p className="text-xs text-muted-foreground">Driver</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default DriverLayout;
