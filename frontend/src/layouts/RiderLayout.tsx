import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, History, LayoutDashboard, LogOut, Menu, Navigation, Settings, ShieldCheck, UserRound, Wallet, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { shortAddress } from "../lib/format";

const items = [
  ["Dashboard", "/rider", LayoutDashboard],
  ["Book a Ride", "/rider/book", Car],
  ["Current Ride", "/rider/current-ride", Navigation],
  ["Ride History", "/rider/history", History],
  ["Payments", "/rider/payments", Wallet],
  ["Drivers", "/rider/drivers", ShieldCheck],
  ["Profile", "/rider/profile", UserRound],
  ["Settings", "/rider/settings", Settings],
];

export default function RiderLayout({ children, activePage = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-muted"><Menu size={22} /></button>
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"><Car size={19} className="text-primary-foreground" /></div><b className="text-lg">CABX</b></div>
        <ThemeToggle />
      </header>

      {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform  ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-20 items-center justify-between border-b border-border px-6 ">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"><Car size={22} className="text-primary-foreground" /></div><div><b className="text-xl">CABX</b><p className="text-xs text-muted-foreground">Rider Portal</p></div></div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <div className="border-b border-border p-5 "><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{user?.name?.[0]?.toUpperCase() || "R"}</div><div className="min-w-0"><p className="truncate font-semibold">{user?.name || "CabX Rider"}</p><p className="text-xs text-muted-foreground">Rider account</p></div></div></div>
        <nav className="flex-1 space-y-1 p-4">{items.map(([label, path, Icon]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${activePage === label || location.pathname === path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon size={19} /><span>{label}</span></Link>)}</nav>
        <div className="border-t border-border p-4"><button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"><LogOut size={19} />Logout</button></div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-border bg-card px-8  lg:flex">
          <div><h2 className="text-xl font-bold">{activePage}</h2><p className="mt-1 text-sm text-muted-foreground">Your CabX rider experience</p></div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="ml-2 flex items-center gap-3 border-l border-border pl-4 "><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{user?.name?.[0]?.toUpperCase() || "R"}</div><div><p className="text-sm font-semibold">{user?.name || "Rider"}</p><p className="text-xs text-muted-foreground">{user?.walletAddress ? shortAddress(user.walletAddress) : "Wallet not linked"}</p></div></div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
