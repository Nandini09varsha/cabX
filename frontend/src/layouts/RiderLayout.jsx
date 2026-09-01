import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Car, History, LayoutDashboard, LogOut, Menu, Navigation, Settings, UserRound, Wallet, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/riderMockData";

const items = [
  ["Dashboard", "/rider", LayoutDashboard],
  ["Book a Ride", "/rider/book", Car],
  ["Current Ride", "/rider/current-ride", Navigation],
  ["Ride History", "/rider/history", History],
  ["Payments", "/rider/payments", Wallet],
  ["Profile", "/rider/profile", UserRound],
  ["Settings", "/rider/settings", Settings],
];

export default function RiderLayout({ children, activePage = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0B] dark:bg-[#0B0B0B] dark:text-white">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur dark:border-[#2A2A2A] dark:bg-[#111]/95 lg:hidden">
        <button onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-[#222]"><Menu size={22} /></button>
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5C518]"><Car size={19} className="text-black" /></div><b className="text-lg">CABX</b></div>
        <ThemeToggle />
      </header>

      {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform dark:border-[#2A2A2A] dark:bg-[#111] ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]"><Car size={22} className="text-black" /></div><div><b className="text-xl">CABX</b><p className="text-xs text-gray-500 dark:text-gray-400">Rider Portal</p></div></div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <div className="border-b border-gray-200 p-5 dark:border-[#2A2A2A]"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">{user?.name?.[0]?.toUpperCase() || "R"}</div><div className="min-w-0"><p className="truncate font-semibold">{user?.name || "CabX Rider"}</p><p className="text-xs text-gray-500 dark:text-gray-400">Rider account</p></div></div></div>
        <nav className="flex-1 space-y-1 p-4">{items.map(([label, path, Icon]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${activePage === label || location.pathname === path ? "bg-[#F5C518] text-black" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1F1F1F]"}`}><Icon size={19} /><span>{label}</span></Link>)}</nav>
        <div className="border-t border-gray-200 p-4 dark:border-[#2A2A2A]"><button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/30"><LogOut size={19} />Logout</button></div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-[#2A2A2A] dark:bg-[#111] lg:flex">
          <div><h2 className="text-xl font-bold">{activePage}</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your CabX rider experience</p></div>
          <div className="flex items-center gap-3">
            <div className="relative"><button onClick={() => setShowNotifications((v) => !v)} className="relative rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-[#1F1F1F]"><Bell size={20} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F5C518]" /></button>{showNotifications && <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-[#2A2A2A] dark:bg-[#171717]"><div className="flex items-center justify-between px-2 py-2"><b>Notifications</b><span className="text-xs text-gray-500">2 new</span></div>{notifications.map((n) => <div key={n.id} className="rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-[#202020]"><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{n.text}</p><p className="mt-1 text-[11px] text-gray-400">{n.time}</p></div>)}</div>}</div>
            <ThemeToggle />
            <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-[#2A2A2A]"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C518] font-bold text-black">{user?.name?.[0]?.toUpperCase() || "R"}</div><div><p className="text-sm font-semibold">{user?.name || "Rider"}</p><p className="text-xs text-gray-500 dark:text-gray-400">Rider</p></div></div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
