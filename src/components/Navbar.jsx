import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HamburgerBtn from "./HamburgerBtn";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    // Optional logging
    console.log("Menu is now", menuOpen ? "open" : "closed");
  }, [menuOpen]);

  return (
    <nav className="Navbar-container">
      {/* Hamburger menu toggle */}
      <button
        className="Collapse-btn"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <HamburgerBtn isActive={menuOpen} />
      </button>

      {/* Brand/Logo */}
      <Link className="navbar-brand" to="/">
        Better State LLC
      </Link>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? "show" : ""}`} id="nav-btn-collapse">
        <Link className="NavLink" to="/">Home</Link>
        <Link className="NavLink" to="/whatwedo">What We Do</Link>
        <Link className="NavLink" to="/about">About Us</Link>
        <Link className="NavLink" to="/book_online">Book Online</Link> {/* maybe remove */}
        <Link className="NavLink" to="/contact">Contact Us</Link>
      </div>
    </nav>
  );
}
