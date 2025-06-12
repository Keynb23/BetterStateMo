import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HamburgerBtn from "./HamburgerBtn.jsx";
import { useMedia } from "../context/MediaContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Import auth methods

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false); // State to control auth dropdown visibility
  const [activeAuthTab, setActiveAuthTab] = useState('login'); // 'login' or 'create-account'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Corrected: removed extra '('
  const [authError, setAuthError] = useState('');

  const authContext = useAuth();
  const user = authContext?.user;
  const loading = authContext?.loading;
  const auth = authContext?.auth; // Get auth instance from context
  const signOut = authContext?.signOut; // Get signOut function from context

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setShowAuthDropdown(false); // Close auth dropdown if hamburger is toggled
  };
  const closeMenu = () => setMenuOpen(false);

  const toggleAuthDropdown = () => {
    setShowAuthDropdown((prev) => !prev);
    setMenuOpen(false); // Close hamburger menu if auth dropdown is toggled
    setAuthError(''); // Clear error on toggle
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!auth) {
      setAuthError('Authentication not initialized.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setShowAuthDropdown(false); // Close dropdown on successful login
      navigate('/profile'); // Redirect to profile page after login
    } catch (err) {
      console.error("Login error:", err);
      setAuthError('Login failed. Please check your credentials.');
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!auth) {
      setAuthError('Authentication not initialized.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setShowAuthDropdown(false); // Close dropdown on successful creation
      navigate('/profile'); // Redirect to profile page after account creation
    } catch (err) {
      console.error("Create account error:", err);
      setAuthError('Account creation failed. Email might already be in use or password too weak.');
    }
  };

  useEffect(() => {
    // This effect ensures that the auth dropdown closes when a user logs in/out,
    // or when the loading state changes for authentication.
    if (!loading && user) {
      setShowAuthDropdown(false);
    }
  }, [user, loading]);


  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(sectionId), 50);
    } else {
      scrollToSection(sectionId);
    }
    closeMenu();
    setShowAuthDropdown(false); // Also close auth dropdown when navigating to sections
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { owners } = useMedia();

  // Show loading indicator in Navbar
  if (loading) {
    return (
      <nav className="Navbar-container">
        <div className="Navbar-loading">Loading...</div>
      </nav>
    );
  }

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
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <img src={owners.logo} alt="Logo" />
        </Link>
        <div
          className={`navbar-links ${menuOpen ? "show" : ""}`}
          id="nav-btn-collapse"
        >
          <button className="NavScroll-btn" onClick={() => handleScroll("home")}>
            Home
          </button>
          <button className="NavScroll-btn" onClick={() => handleScroll("services")}>
            Services
          </button>
          <button className="NavScroll-btn" onClick={() => handleScroll("about")}>
            About
          </button>
          <Link className="NavLink" to="/setapt" onClick={closeMenu}>
            Set Appointment
          </Link>
          <button className="NavScroll-btn" onClick={() => handleScroll("contact")}>
            Contact
          </button>

          {/* Conditional rendering for Auth UI */}
          {!user ? ( // If not logged in
            <div className="Navbar-authContainer">
              <button className="NavLink Navbar-loginButton" onClick={toggleAuthDropdown}>
                Log in
              </button>
              {showAuthDropdown && (
                <div className="Navbar-dropdown">
                  <div className="Navbar-dropdownTabs">
                    <button
                      className={`Navbar-tabButton ${activeAuthTab === 'login' ? 'Navbar-tabButton--active' : ''}`}
                      onClick={() => setActiveAuthTab('login')}
                    >
                      Log in
                    </button>
                    <button
                      className={`Navbar-tabButton ${activeAuthTab === 'create-account' ? 'Navbar-tabButton--active' : ''}`}
                      onClick={() => setActiveAuthTab('create-account')}
                    >
                      Create Account
                    </button>
                  </div>
                  <div className="Navbar-formSection">
                    {activeAuthTab === 'login' && (
                      <form onSubmit={handleLogin} className="Navbar-form">
                        <div className="Navbar-formGroup">
                          <label className="Navbar-label" htmlFor="login-email">Email</label>
                          <input
                            type="email"
                            id="login-email"
                            className="Navbar-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="Navbar-formGroup">
                          <label className="Navbar-label" htmlFor="login-password">Password</label>
                          <input
                            type="password"
                            id="login-password"
                            className="Navbar-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        {authError && <p className="Navbar-error">{authError}</p>}
                        <button type="submit" className="Navbar-submitBtn">Log In</button>
                      </form>
                    )}
                    {activeAuthTab === 'create-account' && (
                      <form onSubmit={handleCreateAccount} className="Navbar-form">
                        <div className="Navbar-formGroup">
                          <label className="Navbar-label" htmlFor="create-email">Email</label>
                          <input
                            type="email"
                            id="create-email"
                            className="Navbar-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="Navbar-formGroup">
                          <label className="Navbar-label" htmlFor="create-password">Password</label>
                          <input
                            type="password"
                            id="create-password"
                            className="Navbar-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        {authError && <p className="Navbar-error">{authError}</p>}
                        <button type="submit" className="Navbar-submitBtn">Create Account</button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : ( // If logged in
            <>
              <Link className="NavLink Navbar-profileIcon" to="/profile" onClick={() => { closeMenu(); setShowAuthDropdown(false); }}>
                <i className="fa-solid fa-user-circle"></i>
              </Link>
              <button className="NavLink Navbar-logoutButton" onClick={() => { signOut(auth); closeMenu(); setShowAuthDropdown(false); }}>
                Log out
              </button>
            </>
          )}
        </div>
        <button className="phoneNumber">
          <a href="tel:913-270-0518">
            <span className="full-text"></span>
            <i className="fas fa-phone phone-icon" aria-hidden="true"></i>
          </a>
        </button>
      </nav>
      <Outlet />
    </>
  );
}
