import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./ComponentStyles.css";
import EditedDroneVid from "../assets/videos/EditedDroneVid.mp4";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import "aos/dist/aos.css";

const Hero = () => {

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="Hero-bg-img"></div>

        <div className="hero-bg-vid">
          <video autoPlay loop muted>
            <source src={EditedDroneVid} type="video/mp4" />
          </video>
        </div>

        <div className="hero-title">
          <h1>BETTER <span className="changing-word"></span></h1>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-button"
            onClick={() => scrollToSection("services")}>
            Explore Our Services
          </button>
        </div>

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
    </div>
  );
};

export default Hero;
