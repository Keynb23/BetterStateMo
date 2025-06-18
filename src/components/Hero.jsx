import "./ComponentStyles.css";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import water from "../assets/water.png";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  const navigateToSetApt = () => {
    navigate("/setapt");
  }
  return (
    <div className="hero-container">
      <img src={water}
      alt ='water' className="hero-image" />
      <div className="hero-overlay"></div>
      

      <div className="hero-content">
        <div className="hero-text-block">
          <h1 className="hero-heading">Better State MO</h1>
          <p className="hero-subheading">Better Pools  Better Service</p>

          <div className="space-y-8">
            <button onClick={navigateToSetApt} className="hero-button">Request Service</button>

            <div className="hero-contacts">
              <a href="tel:+1234567890" className="hero-contact-link">
                <FaPhone className="text-lg" />
                <span>Call Us: 573-826-9529</span>
              </a>
              <a href="mailto:info@betterstate.com" className="hero-contact-link">
                <FaEnvelope className="text-lg" />
                <span>Email: betterstatemo@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          © 2024 Better State Pool Services. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Hero;