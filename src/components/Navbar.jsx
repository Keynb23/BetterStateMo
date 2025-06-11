import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HamburgerBtn from "./HamburgerBtn";
import { useMedia } from "../context/MediaContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  useEffect(() => {
    
  }, [menuOpen]);

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });

      // Delay scroll to let homepage renger
      setTimeout(() => scrollToSection(sectionId), 50);
    } else {
      scrollToSection(sectionId);
    }
  };
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { owners } = useMedia();

  return (
    <>
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
          <img src={owners.logo} alt="Logo" />
        </Link>
        {/* Links */}
        <div
          className={`navbar-links ${menuOpen ? "show" : ""}`}
          id="nav-btn-collapse"
        >
          <button
            className="NavScroll-btn"
            onClick={() => handleScroll("home")}
          >
            Home
          </button>
          <button
            className="NavScroll-btn"
            onClick={() => handleScroll("services")}
          >
            Services
          </button>
          <button
            className="NavScroll-btn"
            onClick={() => handleScroll("about")}
          >
            About
          </button>
          <Link className="NavLink" to="/setapt">
            Set Appointment
          </Link>
          <button
            className="NavScroll-btn"
            onClick={() => handleScroll("contact")}
          >
            Contact
          </button>
        </div>
        <button className="phoneNumber">
          <a href="tel:913-270-0518">
            <span className="full-text">573-823-6325 or 573-826-9529</span>
            <i className="fas fa-phone phone-icon" aria-hidden="true"></i>
          </a>
        </button>
      </nav>
      <Outlet />
    </>
  );
}
