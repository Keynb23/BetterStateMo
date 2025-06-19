import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./ComponentStyles.css"; 
import RequestQuote from '../context/RequestQuote';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="hero-container">
      <div className="hero-content"></div>
        <h1 className="hero-title">Welcome to Our Pool Services</h1>
      </div>
      <p className="hero-description">
        Your one-stop solution for all pool maintenance needs. From cleaning to repairs, we ensure your pool is always ready for a swim.
      </p>
      <div className="hero-buttons">
        <button className="hero-button" onClick={() => navigate("/services")}>
          Explore Our Services
        </button>
        <button className="hero-button" onClick={() => navigate("/contact")}>
          Contact Us
        </button>
        <button className="hero-button" onClick={() => navigate("/setapt")}>
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
    </>
  );
};

export default Hero;
