import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect
import HamburgerBtn from "./HamburgerBtn.jsx";
import { useMedia } from "../context/MediaContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LoginReg from "./loginReg.jsx";
import './ComponentStyles.css';

// Accept the isVisible prop from App.jsx
export default function Navbar({ isVisible }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const { owners } = useMedia();
  const { user, auth, signOut } = useAuth();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown((prev) => !prev);
    setMenuOpen(false); // Close main menu if auth dropdown opens
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
      // Use a timeout to ensure navigation completes before attempting to scroll
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

  // Add an effect to close menus if navigation occurs (e.g., from an internal link)
  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]); // Re-run when pathname changes

  return (
    // Apply conditional class based on isVisible prop
    <nav className={`Navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
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
        <button className="NavScroll-btn" onClick={() => handleScroll("home")}>Home</button>
        <button className="NavScroll-btn" onClick={() => handleScroll("services")}>Services</button>
        <button className="NavScroll-btn" onClick={() => handleScroll("about")}>About</button>
        <Link className="NavLink" to="/setapt" onClick={closeAllMenus}>Appointment</Link>
        <button className="NavScroll-btn" onClick={() => handleScroll("contact")}>Contact</button>
        <Link className="NavLink" to="/gallery" onClick={closeAllMenus}>Gallery</Link>
      </div>

      <div className="navbar-actions">
        <div className="Navbar-dropdown">
          <button className="Navbar-profileIcon" onClick={toggleAuthDropdown}>
            {/* Using Font Awesome icon directly from class */}
            <i className="fa-solid fa-user-circle"></i>
          </button>
          {showAuthDropdown && (
            <div className="Navbar-authDropdown">
              {user ? (
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
      <Outlet />
    </nav>
  );
}