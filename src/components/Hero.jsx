import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./ComponentStyles.css";
import RequestQuote from '../context/RequestQuote';


const Hero = () => {
  const navigate = useNavigate();

  // Function to handle smooth scrolling to a section ID
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Use smooth scroll behavior
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-container">
      {/* Optional: Placeholder for an image within the content */}
      {/* <div className="hero-image-placeholder">Your Image Here</div> */}

      <div className="hero-content">
        <h1 className="hero-title">Welcome to Our Pool Services</h1>
        <p className="hero-description">
          Your one-stop solution for all pool maintenance needs. From cleaning to repairs, we ensure your pool is always ready for a swim.
        </p>
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

      <div className="hero-contacts">
        <div className="hero-contact-item">
          <FaPhone className="hero-icon" />
          <span className="hero-contact-text">Call Us: (123) 456-7890</span>
        </div>
        <div className="hero-contact-item">
          <FaEnvelope className="hero-icon" />
          <span className="hero-contact-text">Email: betterstatemo@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;