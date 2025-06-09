import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // ✅ make sure you import `Outlet`
import { useEffect, useState } from "react";
import HamburgerBtn from "./HamburgerBtn";
import { useMedia } from '../context/MediaContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    console.log("Menu is now", menuOpen ? "open" : "closed");
  }, [menuOpen]);

  const handleScroll = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false })
      // Delay scroll to let homepage renger
      setTimeout(() => scrollToSection(sectionId), 50)
    } else {
      scrollToSection(sectionId)
    }
  }
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const { owners } = useMedia()

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
        <div className={`navbar-links ${menuOpen ? "show" : ""}`} id="nav-btn-collapse">
          <button className="NavScroll-btn" onClick={() => handleScroll('home')}>Home</button>
          <button className="NavScroll-btn" onClick={() => handleScroll('services')}>Services</button>
          <button className="NavScroll-btn" onClick={() => handleScroll('about')}>About</button>
          <Link className="NavLink" to="/setapt">Set Appointment</Link> {/* maybe remove */}
          <button className="NavScroll-btn" onClick={() => handleScroll('contact')}>Contact</button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
