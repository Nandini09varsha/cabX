import { useState } from "react";
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
  Bell,
  Star,
  Navigation,
} from "lucide-react";

import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function DriverLayout({ children, activePage = "Dashboard" }) {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/driver",
    },
    {
      label: "Ride Requests",
      icon: Car,
      path: "/driver/requests",
      badge: 2,
    },
    {
      label: "Current Ride",
      icon: Navigation,
      path: "/driver/current-ride",
    },
    {
      label: "Ride History",
      icon: History,
      path: "/driver/history",
    },
    {
      label: "Earnings",
      icon: Wallet,
      path: "/driver/earnings",
    },
    {
      label: "Profile",
      icon: UserRound,
      path: "/driver/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/driver/settings",
    },
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0B] dark:bg-[#0B0B0B] dark:text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-[#2A2A2A] dark:bg-[#111111]/95 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#222]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518]">
            <Car size={18} className="text-black" />
          </div>

          <span className="text-xl font-black tracking-tight">CABX</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="relative rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#222]"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F5C518]" />
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-[#2A2A2A] dark:bg-[#111111] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]">
              <Car size={22} className="text-black" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">CABX</h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Driver Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#222] lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Driver Info */}
        <div className="border-b border-gray-200 p-5 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {user?.name || "CabX Driver"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Star size={12} className="fill-current" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.label;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#F5C518] text-black"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1F1F1F]"
                }`}
              >
                <Icon size={19} />

                <span className="flex-1 text-left">{item.label}</span>

                {item.badge && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-[#F5C518] text-black"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Online Status + Logout */}
        <div className="border-t border-gray-200 p-4 dark:border-[#2A2A2A]">
          <button
            onClick={() => setIsOnline((prev) => !prev)}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3 dark:bg-[#1B1B1B]"
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />

              <span className="text-sm font-medium">
                {isOnline ? "You're Online" : "You're Offline"}
              </span>
            </div>

            <div
              className={`relative h-5 w-9 rounded-full transition ${
                isOnline ? "bg-[#F5C518]" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow transition ${
                  isOnline ? "left-5" : "left-1"
                }`}
              />
            </div>
          </button>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        {/* Desktop Header */}
        <header className="hidden h-20 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-[#2A2A2A] dark:bg-[#111111] lg:flex">
          <div>
            <h2 className="text-xl font-bold">{activePage}</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your CabX driver account
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-xl p-2.5 transition hover:bg-gray-100 dark:hover:bg-[#1F1F1F]"
              aria-label="Notifications"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F5C518]" />
            </button>

            <ThemeToggle />

            <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-[#2A2A2A]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">
                {user?.name?.charAt(0)?.toUpperCase() || "D"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user?.name || "Driver"}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Driver
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DriverLayout;
