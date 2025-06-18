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

function App() {
  useLocation();

  return (
    <>

      <div className="app-container">
        
        
        
        <Navbar />
        <Routes>
          {/* Scrollable homepage route */}
          <Route
            path="/"
            element={
              <>
                <section id="home">
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
