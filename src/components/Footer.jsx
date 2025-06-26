import "./ComponentStyles.css";
import Map from "./Map.jsx";
import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import linkedin from '../assets/linkedin.png'
import Github from '../assets/Github.png'


export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content-top">
      <footer className="footer-note">
        All rights reserved. 2025. Better State LLC.
      </footer>

      <div className="footer-social-media">
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

      <div className="footer-contact">Tel: 573-826-9529</div>
      <div className="footer-hours">
        <p>8am - 7pm</p>
        <p>Monday - Friday</p>
      </div>

      <div className="footer-coverage">
        <Map />
      </div>
      </div>

      <div className="step1">
        supposed to be stairs. here you could put the logo's of the brands and companies you work with.
        or the products you use? idk if that's legal though. Maybe advertisement or something.
      </div>

      <div className="step2">
        maybe a link to the other site?
      </div>

      <div className="Devby">
        A Key'nB Production
        <div className="Devby-links">
          <a
            href="https://www.linkedin.com/in/key-n-brosdahl-5320b3353/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedin} alt="LinkedIn" />
          </a>
          <a
            href="https://github.com/Keynb23"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Github} alt="GitHub" />
          </a>
          {/* Add your portfolio later when it's ready */}
        </div>
      </div>
    </div>
  );
}
