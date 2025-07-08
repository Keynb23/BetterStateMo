// import { useState } from 'react';
import { useEffect } from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import './ComponentStyles.css';
// import EditedDroneVid from '../assets/videos/EditedDroneVid.mp4';
import facebook from '../assets/socials/facebook.png';
import instagram from '../assets/socials/instagram.png';
import Logo from '../assets/owners/Logo.png'; 
import BrownBlue from '../assets/pools/Halfwall4.jpg'; // this is the new bg img

const Hero = () => {
  // const [videoLoaded, setVideoLoaded] = useState(false);
  // Effect to delay video rendering to prevent initial flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      // setVideoLoaded(true);
    }, 150); 

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-container">
      {/* Commented out video background */}
      {/* {videoLoaded && (
        <div className="hero-background-video">
          <video autoPlay loop muted playsInline>
            <source src={EditedDroneVid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
      )} */}

      {/* Image background added */}
      <div className="hero-background-video">
        <img src={BrownBlue} alt="Brown Blue Pool Background" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
        <div className="video-overlay"></div>
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-top-content">
          <div className="Hero-logo">
            <img src={Logo} alt="Better State LLC Logo" />
          </div>
          <div className="hero-title">
            <h1>BETTER STATE LLC</h1>
            
          </div>
          <p className="hero-slogan">Enjoy your pool-We'll handle the rest</p>
        </div>
        {/* Call to Action Button */}
        <div className="hero-buttons">
          <button className="hero-button" onClick={() => scrollToSection('services')}>
            Explore Our Services
          </button>
        </div>
        {/* Bottom section: Social Media & Contacts */}
        <div className="hero-bottom-content">
          <div className="Hero-social-media">
            <a
              href="https://www.facebook.com/betterstatemo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit us on Facebook"
            >
              <img src={facebook} alt="Facebook icon" />
            </a>
            <a
              href="https://www.instagram.com/betterstatellc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit us on Instagram"
            >
              <img src={instagram} alt="Instagram icon" />
            </a>
          </div>
          <div className="hero-contacts">
            <div className="hero-contact-item">
              <FaPhone className="hero-icon" />
              <span className="hero-contact-text">Call Us: 573-823-6325</span>
            </div>
            <div className="hero-contact-item">
              <FaEnvelope className="hero-icon" />
              <span className="hero-contact-text">Email: betterstatemo@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;