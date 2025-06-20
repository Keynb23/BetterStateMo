import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./ComponentStyles.css";
import RequestQuote from "../context/RequestQuote";
import EditedDroneVid from "../assets/videos/EditedDroneVid.mp4";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import LshapedPool from '../assets/pools/LshapedPool.jpg';

const Hero = () => {
  const navigate = useNavigate();

  // Function to handle smooth scrolling to a section ID
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Use smooth scroll behavior
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="Hero-bg-img">
          <img src={LshapedPool} alt="Background" />
        </div>
        <button onClick={() => navigate("/gallery")} className="hero-bg-vid">
          <h3>Gallery</h3>
          <video autoPlay loop muted>
            <source src={EditedDroneVid} type="video/mp4" />
          </video>
        </button>
        <h1 className="hero-title">
          Better State Mo
        </h1>
        <div className="hero-description">
          <h3> BETTER POOLS</h3>
          <h3> BETTER SERVICE</h3>
          <h3> BETTER TOGETHER</h3>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-button"
            onClick={() => scrollToSection("services")} // Scroll to the Services section
          >
            Explore Our Services
          </button>
          <button
            className="hero-button"
            onClick={() => scrollToSection("contact")} // Scroll to the Contact section
          >
            Contact Us
          </button>
          <button
            className="hero-button"
            onClick={() => navigate("/setapt")} // Navigate to the Set Appointment page
          >
            Set Appointment
          </button>
          <RequestQuote />
        </div>

        <div className="Hero-social-media">
          <a
            href="https://www.facebook.com/betterstatemo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="facebook" />
          </a>
          <a
            href="https://www.instagram.com/betterstatellc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram} alt="instagram" />
          </a>
        </div>

        <div className="hero-contacts">
          <div className="hero-contact-item">
            <FaPhone className="hero-icon" />
            <span className="hero-contact-text">Call Us: (123) 456-7890</span>
          </div>
          <div className="hero-contact-item">
            <FaEnvelope className="hero-icon" />
            <span className="hero-contact-text">
              Email: betterstatemo@gmail.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
