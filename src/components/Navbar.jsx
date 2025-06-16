import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburgerBtn from "./HamburgerBtn.jsx";
import { useMedia } from "../context/MediaContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; // Import useAuth
import LoginReg from "./loginReg.jsx";
import './ComponentStyles.css'


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const { owners } = useMedia();
  const { user, auth, signOut } = useAuth(); // Get user and signOut from context

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown((prev) => !prev);
    setMenuOpen(false);
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setShowAuthDropdown(false);
  };

  const handleLogout = () => {
    signOut(auth);
    closeAllMenus();
    navigate("/"); // Navigate to home page on logout
  };

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(sectionId), 50);
    } else {
      scrollToSection(sectionId);
    }
    closeAllMenus();
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="Navbar-container">
        <button
          className="Collapse-btn"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <HamburgerBtn isActive={menuOpen} />
        </button>

        <Link className="navbar-brand" to="/" onClick={closeAllMenus}>
          <img src={owners.logo} alt="Logo" />
        </Link>

        <div
          className={`navbar-links ${menuOpen ? "show" : ""}`}
          id="nav-btn-collapse"
        >
          {/* ... Your NavScroll buttons ... */}
          <button className="NavScroll-btn" onClick={() => handleScroll("home")}>Home</button>
          <button className="NavScroll-btn" onClick={() => handleScroll("services")}>Services</button>
          <button className="NavScroll-btn" onClick={() => handleScroll("about")}>About</button>
          <Link className="NavLink" to="/setapt" onClick={closeAllMenus}>Appointment</Link>
          <button className="NavScroll-btn" onClick={() => handleScroll("contact")}>Contact</button>
        </div>

        <div className="navbar-actions">
          <div className="Navbar-dropdown">
            <button className="Navbar-profileIcon" onClick={toggleAuthDropdown}>
              <i className="fa-solid fa-user-circle"></i>
            </button>
            {showAuthDropdown && (
              <div className="Navbar-authDropdown">
                {user ? (
                  // LOGGED-IN VIEW
                  <div className="profile-dropdown-menu">
                    <Link
                      to="/profile"
                      className="profile-dropdown-button"
                      onClick={closeAllMenus}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="profile-dropdown-button logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  // LOGGED-OUT VIEW
                  <LoginReg />
                )}
              </div>
            )}
          </div>

          <button className="phoneNumber">
            <a href="tel:913-270-0518">
              <span className="full-text"></span>
              <i className="fas fa-phone phone-icon" aria-hidden="true"></i>
            </a>
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}