import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Add scroll detection for enhanced shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-black/95 backdrop-blur-lg py-4 fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="font-playfair text-xl sm:text-2xl text-white no-underline"
        >
          Replace<span className="text-crimson">able</span>.ai
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className={`font-inter text-sm font-medium transition-colors ${
              isActive("/") ? "text-white" : "text-titanium hover:text-white"
            }`}
          >
            Intelligence
          </Link>
          <Link
            to="/archive"
            className={`font-inter text-sm font-medium transition-colors ${
              isActive("/archive")
                ? "text-white"
                : "text-titanium hover:text-white"
            }`}
          >
            Archive
          </Link>

          {/* Auth Section */}
          {isAuthenticated() ? (
            <div className="flex items-center gap-4">
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-wider bg-crimson text-white px-3 lg:px-4 py-2 hover:bg-deep-crimson transition-colors"
                >
                  <LayoutDashboard size={14} />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="font-inter text-xs text-titanium hidden lg:flex items-center gap-2">
                  <User size={14} />
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 font-inter text-xs text-mist hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-inter text-xs font-semibold uppercase tracking-wider bg-white/10 text-white px-4 py-2 hover:bg-white/20 transition-colors"
            >
              Admin Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white p-2 hover:bg-white/10 transition-colors rounded"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-lg border-b border-white/5 transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <nav className="flex flex-col py-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`font-inter text-sm font-medium px-6 py-3 transition-colors ${
              isActive("/")
                ? "text-white bg-white/5"
                : "text-titanium hover:text-white hover:bg-white/5"
            }`}
          >
            Intelligence
          </Link>
          <Link
            to="/archive"
            onClick={closeMobileMenu}
            className={`font-inter text-sm font-medium px-6 py-3 transition-colors ${
              isActive("/archive")
                ? "text-white bg-white/5"
                : "text-titanium hover:text-white hover:bg-white/5"
            }`}
          >
            Archive
          </Link>

          {/* Mobile Auth Section */}
          <div className="border-t border-white/10 mt-2 pt-2">
            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 font-inter text-sm font-medium px-6 py-3 text-crimson hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="font-inter text-xs text-titanium flex items-center gap-2">
                    <User size={14} />
                    {user?.username}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-2 font-inter text-xs text-mist hover:text-white transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center mx-6 my-3 font-inter text-xs font-semibold uppercase tracking-wider bg-white/10 text-white px-4 py-3 hover:bg-white/20 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
