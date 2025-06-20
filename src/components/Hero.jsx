import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "./ComponentStyles.css";
import RequestQuote from "../context/RequestQuote";
import EditedDroneVid from "../assets/videos/EditedDroneVid.mp4";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import "aos/dist/aos.css";

const Hero = () => {
  const navigate = useNavigate();

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  // Define only the *second* part of the phrases to cycle through
  const cyclingWords = [
    "Pools",
    "Service",
    "Together",
    "State",
  ];

  // Define your color palette in the order you want them to cycle
  const cyclingColors = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
    "var(--color-bg)",
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const heroCoverTitle = document.querySelector(".Hero-Cover-title");
    if (heroCoverTitle) {
      const shadowCount = 35;
      const shadowColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--hero-cover-secondary")
        .trim();

      let shadowString = "0 0 0px " + shadowColor;
      for (let i = 1; i <= shadowCount; i++) {
        shadowString += `, ${i}px ${i}px ${shadowColor}`;
      }
      heroCoverTitle.style.textShadow = shadowString;
    }
  }, []);

  useEffect(() => {
    const intervalTime = 1500;
    const cycleInterval = setInterval(() => {
      setActiveWordIndex((prevIndex) =>
        (prevIndex + 1) % cyclingWords.length
      );
    }, intervalTime);

    return () => clearInterval(cycleInterval);
  }, [cyclingWords.length]);

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
          <h1 className="static-better">BETTER</h1>
          <div className="cycling-word-container">
            {cyclingWords.map((word, index) => (
              <h1
                key={index}
                className={activeWordIndex === index ? "active-cycling-word" : ""}
                style={{ color: cyclingColors[index] }} // Apply dynamic color here
              >
                {word}
              </h1>
            ))}
          </div>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-button"
            onClick={() => scrollToSection("services")}
          >
            Explore Our Services
          </button>
          <button
            className="hero-button"
            onClick={() => scrollToSection("contact")}
          >
            Contact Us
          </button>
          <button className="hero-button" onClick={() => navigate("/setapt")}>
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