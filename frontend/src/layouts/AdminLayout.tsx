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
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-border bg-card  lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-border px-6 ">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-black">C</div>
          <div>
            <b className="text-xl">CABX</b>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {items.map(([label, path, Icon]) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                activePage === label
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <header className="flex h-20 items-center justify-between border-b border-border bg-card px-6 ">
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
