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

const ctaClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-extrabold text-primary-foreground">C</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            Cab<span className="text-primary">X</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <ThemeToggle />
          {user ? (
            <Link to={homeFor(user.role)} className={ctaClass}>
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Login
              </Link>
              <Link to="/register" className={ctaClass}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle menu"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-border bg-card px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
            <a href="#features" onClick={() => setMobileMenu(false)}>Features</a>
            {user ? (
              <Link to={homeFor(user.role)} onClick={() => setMobileMenu(false)} className="font-semibold">
                Open app
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenu(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenu(false)} className={`${ctaClass} text-center`}>
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
