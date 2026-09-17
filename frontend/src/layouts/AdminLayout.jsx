import { Link, useNavigate } from "react-router-dom";
import { LogOut, Shield, Users } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const items = [
  ["Overview", "/admin", Shield],
  ["Drivers", "/admin/drivers", Users],
];

export default function AdminLayout({ children, activePage = "Overview" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0B] dark:bg-[#0B0B0B] dark:text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#111] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-gray-200 px-6 dark:border-[#2A2A2A]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518] font-black">C</div>
          <div>
            <b className="text-xl">CABX</b>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {items.map(([label, path, Icon]) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                activePage === label
                  ? "bg-[#F5C518] text-black"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1F1F1F]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="m-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="lg:ml-72">
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-[#2A2A2A] dark:bg-[#111]">
          <h2 className="text-xl font-bold">{activePage}</h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-sm font-semibold">{user?.name}</div>
          </div>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
