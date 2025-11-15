import { Routes, Route, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Contact from './pages/Contact.jsx';
import About from './About/About.jsx'; // Updated import path for the About component
import ServicesIndex from './pages/Services/ServicesIndex.jsx';
import Home from './pages/Home.jsx';
import SetApt from './pages/Apt/SetApt.jsx';
import LoginReg from './components/loginReg.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import ObjectionBlockers from './components/objectionBlockers.jsx';
import Footer from './components/Footer.jsx';
import Gallery from './components/Gallery.jsx';
import { useState, useEffect } from 'react';
import Reviews from './components/Reviews.jsx';
import RequestQuote from './context/RequestQuote'; 

// commit change
function App() {
  const location = useLocation();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsNavbarVisible(!entry.isIntersecting || entry.intersectionRatio < 0.1);
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.1],
          },
        );
        observer.observe(heroSection);
        return () => {
          observer.unobserve(heroSection);
        };
      }
    } else {
      setIsNavbarVisible(true);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="app-container">
        <Navbar isVisible={isNavbarVisible} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section id="hero-section"><Home /></section>
                <section id="services"><ServicesIndex /></section>
                <section id="about"><About /></section>
                <ObjectionBlockers />
                <Reviews />
                <section id="contact"><Contact /></section>
              </>
            }
          />
          <Route path="/setapt" element={<SetApt />} />
          <Route path="/login" element={<LoginReg />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
        <RequestQuote />
        <Footer />
      </div>
    </>
  );
}

export default App;
