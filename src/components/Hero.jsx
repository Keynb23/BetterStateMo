import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./ComponentStyles.css";
import EditedDroneVid from "../assets/videos/EditedDroneVid.mp4";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import Logo from "../assets/owners/Logo.png";

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-background-video">
        <video autoPlay loop muted>
          <source src={EditedDroneVid} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="hero-title">
        <h1>
          BETTER STATE LLC<span className="changing-word"></span>
        </h1>
        <div className="hero-slogan">
          <p>Better Pools - Even Better Service</p>
        </div>
      </div>

      <div className="hero-content-left">
        <div className="Hero-logo">
          <img src={Logo} alt="logo" />
        </div>
      </div>
      <div className="hero-content-bottom">
        <div className="Hero-social-media">
          <a
            href="https://www.facebook.com/betterstatemo"
            target="_blank"
            rel="noopener noreferrer">
            <img src={facebook} alt="facebook" />
          </a>
          <a
            href="https://www.instagram.com/betterstatellc/"
            target="_blank"
            rel="noopener noreferrer">
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
      <div className="hero-buttons">
        <button
          className="hero-button"
          onClick={() => scrollToSection("services")}
        >
          Explore Our Services
        </button>
      </div>
    </div>
  );
};

export default Hero;
