import './ComponentStyles.css';
import facebook from '../assets/socials/facebook.png';
import instagram from '../assets/socials/instagram.png';
import linkedin from '../assets/linkedin.blue.png';
import Github from '../assets/github.purple.png';
import Missouri from '../assets/states/Missouri.png';
import natChem from '../assets/products/natchem.png';
import poolFrog from '../assets/products/poolFrog.png';
import sanitify from '../assets/products/sanitify.png';
import SeaKlear from '../assets/products/SeaKlear.webp';

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-top-columns">
        <div className="footer-column footer-about">
          <h1 className="footer-heading">Better State LLC</h1>
          <h2 className="footer-slogan">Better Pools & Better Service</h2>
          <img className="footer-map" src={Missouri} alt="Missouri Service Area" />
        </div>

        <div className="footer-column footer-contact-info">
          <h3 className="column-title">Contact Information</h3>
          <div className="footer-contact">
            573-823-6325
            <p>Betterstatemo@gmail.com</p>
            <div className="footer-hours">
              <p>8am - 7pm</p>
              <p>Monday - Friday</p>
            </div>
          </div>
        </div>

        <div className="footer-column footer-social-connect">
          <h3 className="column-title">Connect With Us</h3>
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
        </div>
      </div>

      <div className="disclaimer-section">
        <h2 className="Disclaimers-title">Our Commitment to Quality Products</h2>
        <p className="Disclaimers-text">
          At Better State Mo, we believe in using only the best products to service your pool. We
          may feature the logos of the brands and products we trust and use daily. Please note that
          all featured logos, brand names, and trademarks are the property of their respective
          owners. The use of this third-party intellectual property does not imply any affiliation
          with, or endorsement by, Better State LLC. We are simply proud to use these products for
          our customers.
        </p>
        <div className="footer-products">
          <img className="Fproduct-Logos" src={sanitify} alt="Sanitify" />
          <img className="Fproduct-Logos" src={natChem} alt="NatChem" />
          <img className="Fproduct-Logos" src={poolFrog} alt="PoolFrog" />
          <img className="Fproduct-Logos" src={SeaKlear} alt="SeaKlear" />
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-description copyright-text">
          All rights reserved. 2025. Better State LLC.
        </p>
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
            <a href="https://github.com/Keynb23" target="_blank" rel="noopener noreferrer">
              <img src={Github} alt="GitHub" />
            </a>
            <a className="portfolio-link"> Portfolio link </a>
          </div>
        </div>
      </div>
    </div>
  );
}
