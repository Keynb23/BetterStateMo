import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HamburgerBtn from './HamburgerBtn.jsx';
import { useMedia } from '../context/MediaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import LoginReg from './loginReg.jsx';
import './ComponentStyles.css';

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
    setMenuOpen(false);
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setShowAuthDropdown(false);
  };

  const handleLogout = () => {
    signOut(auth);
    closeAllMenus();
    navigate('/');
  };

  // New helper function for consistent, aggressive scroll to top
  const forceScrollToTop = () => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto', // 'auto' for an instant jump, proven more reliable
      });
    }, 0);
  };

  // Original handleScroll for other sections remains similar but uses scrollToSection
  const handleScroll = (sectionId) => {
    closeAllMenus(); // Close menus regardless
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      // Use a timeout to ensure navigation completes before attempting to scroll
      setTimeout(() => scrollToSection(sectionId), 50);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modified handleLogoClick to use the new forceScrollToTop
  const handleLogoClick = (e) => {
    closeAllMenus();
    if (location.pathname === '/') {
      e.preventDefault(); // Prevent default link behavior if on same page
      forceScrollToTop();
    } else {
      // Allow default Link behavior for navigation.
      // The ScrollToTop component (if you have one in App/main)
      // will handle the scroll for the new route, or you could call forceScrollToTop() here too.
      // For consistency, let's also force it here to guarantee top scroll on navigation.
      // Note: React Router Link will navigate, then this will force scroll.
      navigate('/'); // Ensure navigation to home route
      forceScrollToTop(); // Force scroll after navigation
      e.preventDefault(); // Prevent default Link behavior, as we handle navigation manually here too.
    }
  };

  // New handler for the Home button in the navbar
  const handleHomeButtonClick = () => {
    closeAllMenus(); // Close menus
    if (location.pathname === '/') {
      forceScrollToTop(); // Already on homepage, force scroll to top
    } else {
      navigate('/'); // Navigate to homepage if not already there
      forceScrollToTop(); // Force scroll to top after navigation
    }
  };

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  return (
    <nav className={`Navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <button
        className="Collapse-btn"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <HamburgerBtn isActive={menuOpen} />
      </button>

      {/* Logo Link uses the new handleLogoClick */}
      <Link className="navbar-brand" to="/" onClick={handleLogoClick}>
        <img src={owners.Logo} alt="Logo" />
      </Link>

      <div className={`navbar-links ${menuOpen ? 'show' : ''}`} id="nav-btn-collapse">
        {/* Home button now uses the new handleHomeButtonClick */}
        <button className="NavScroll-btn" onClick={handleHomeButtonClick}>
          Home
        </button>
        <button className="NavScroll-btn" onClick={() => handleScroll('services')}>
          Services
        </button>
        <button className="NavScroll-btn" onClick={() => handleScroll('about')}>
          About
        </button>
        <Link className="NavLink" to="/setapt" onClick={closeAllMenus}>
          Appointment
        </Link>
        <button className="NavScroll-btn" onClick={() => handleScroll('contact')}>
          Contact
        </button>
        <Link className="NavLink" to="/gallery" onClick={closeAllMenus}>
          Gallery
        </Link>
      </div>

      <div className="navbar-actions">
        <div className="Navbar-dropdown">
          <button className="Navbar-profileIcon" onClick={toggleAuthDropdown}>
            <i className="fa-solid fa-user-circle"></i>
          </button>
          {showAuthDropdown && (
            <div className="Navbar-authDropdown">
              {user ? (
                <div className="profile-dropdown-menu">
                  <Link to="/profile" className="profile-dropdown-button" onClick={closeAllMenus}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="profile-dropdown-button logout">
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