import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./NavBar.css";

export default function NavBar() {
  const user = useSelector((state) => state.user.currentUser);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⌨</span>
          <span className="brand-name">
            Paste<span className="brand-accent">Bin</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          <Link to="/" className={isActive("/")}>
            <span className="nav-icon">＋</span>
            New Paste
          </Link>
          <Link to="/latest" className={isActive("/latest")}>
            <span className="nav-icon">◎</span>
            Latest Pastes
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user-group">
              <Link to="/profile" className="navbar-profile-link" title="View Profile">
                <div className="user-avatar">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <span className="user-name">{user.username}</span>
              </Link>
              <Link to="/logout" className="btn-nav-logout">
                Sign Out
              </Link>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="btn-nav-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn-nav-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <Link to="/" className="mobile-link">＋ New Paste</Link>
        <Link to="/latest" className="mobile-link">◎ Latest Pastes</Link>
        {user && <Link to="/profile" className="mobile-link">👤 My Profile</Link>}
        <div className="mobile-divider" />
        {user ? (
          <>
            <span className="mobile-user">Signed in as <b>{user.username}</b></span>
            <Link to="/logout" className="mobile-link signout">Sign Out</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link">Log In</Link>
            <Link to="/register" className="mobile-link accent">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
