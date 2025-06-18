import React from "react"; // ✅ Add this
import "./ComponentStyles.css";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import water from "../assets/water.png";

const Hero = () => {
  const navigate = useNavigate();
  const navigateToSetApt = () => {
    navigate("/setapt");
  };

  return (
    <div className="hero-container">
      <img src={water} alt="water" className="hero-image" />
      {/* rest of your JSX */}
    </div>
  );
};

export default Hero;
