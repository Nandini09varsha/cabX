import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

function homeFor(role) {
  if (role === "driver") return "/driver";
  if (role === "admin") return "/admin";
  return "/rider";
}

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-[#2A2A2A] dark:bg-[#0B0B0B]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]">
            <span className="text-lg font-black text-[#0B0B0B]">C</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0B0B0B] dark:text-white">
            Cab<span className="text-[#F5C518]">X</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-300 dark:hover:text-white">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-300 dark:hover:text-white">
            Features
          </a>
          <ThemeToggle />
          {user ? (
            <Link
              to={homeFor(user.role)}
              className="rounded-full bg-[#0B0B0B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F5C518] hover:text-black dark:bg-[#F5C518] dark:text-black dark:hover:bg-white"
            >
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-[#0B0B0B] dark:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#0B0B0B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F5C518] hover:text-black dark:bg-[#F5C518] dark:text-black dark:hover:bg-white"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 dark:border-[#2A2A2A] dark:bg-[#0B0B0B] md:hidden">
          <div className="flex flex-col gap-5">
            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>
              How it works
            </a>
            <a href="#features" onClick={() => setMobileMenu(false)}>
              Features
            </a>
            {user ? (
              <Link to={homeFor(user.role)} onClick={() => setMobileMenu(false)} className="font-semibold">
                Open app
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenu(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-full bg-[#0B0B0B] px-5 py-3 text-center font-semibold text-white dark:bg-[#F5C518] dark:text-black"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
