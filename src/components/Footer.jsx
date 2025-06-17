import "./ComponentStyles.css";
import Map from "./Map.jsx";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";

export default function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer-note">
        All rights reserved. 2025. Better State LLC.
      </footer>
      <div className="footer-social-media">
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
      <div className="footer-contact">Tel: 573-826-9529</div>
      <div className="footer-hours">
        <h4>8am - 7pm</h4>
        <p>Monday - Friday</p>
      </div>
      <div className="footer-coverage">
        <Map />
      </div>
    </div>
  );
}
