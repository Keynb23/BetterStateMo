import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Contact from "./components/Contact.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Home from "./pages/Home.jsx";
import SetApt from "./pages/SetApt.jsx";
import LoginReg from "./components/loginReg.jsx";
import Profile from "./pages/profile.jsx";
import ObjectionBlockers from "./components/objectionBlockers.jsx";
import Footer from "./components/Footer.jsx";
import Gallery from "./components/Gallery.jsx";
import { useState, useEffect } from 'react'; 

function App() {
  const location = useLocation(); // Keep useLocation

  // State to control Navbar visibility
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  useEffect(() => {
    // Only apply this logic on the homepage ("/")
    if (location.pathname === "/") {
      const heroSection = document.getElementById("hero-section"); // Make sure your Hero component's div has this ID

      if (heroSection) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            // If the hero section is NOT intersecting (i.e., you've scrolled past it)
            // or if it's intersecting but only a small part of it (e.g., threshold 0)
            setIsNavbarVisible(!entry.isIntersecting || entry.intersectionRatio < 0.1);
          },
          {
            root: null, // viewport
            rootMargin: '0px',
            threshold: [0, 0.1], // Observe when 0% or 10% of the target is visible
          }
        );

        observer.observe(heroSection);

        // Cleanup function
        return () => {
          observer.unobserve(heroSection);
        };
      }
    } else {
      // If not on the homepage, ensure Navbar is always visible
      setIsNavbarVisible(true);
    }
  }, [location.pathname]); // Re-run effect when the path changes


  return (
    <>
      <div className="app-container">
        {/* Pass the visibility state as a prop to Navbar */}
        <Navbar isVisible={isNavbarVisible} />
        <Routes>
          {/* Scrollable homepage route */}
          <Route
            path="/"
            element={
              <>
                {/* Add an ID to your Home component's main div so we can observe it */}
                <section id="hero-section">
                  <Home />
                </section>
                <section id="services">
                  <Services />
                </section>
                <section id="about">
                  <About />
                </section>
                <section id="contact">
                  <Contact />
                </section>
                <ObjectionBlockers />
                <Footer />
              </>
            }
          />

          {/* Standalone pages */}
          <Route path="/setapt" element={<SetApt />} />
          <Route path="/login" element={<LoginReg />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gallery" element={<Gallery />} />
          {/* Fallback route */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;