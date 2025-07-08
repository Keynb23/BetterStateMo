// src/pages/About/AboutDesktop.jsx
import { useState, useCallback } from 'react';
import { useMedia } from '../../context/MediaContext';
import closeup from '../../assets/Trucks/closeup.jpg';
import WhiteBTtruck from '../../assets/Trucks/blackClose.jpg';
import './AboutStyles.css';

export default function AboutDesktop() {
  const { owners } = useMedia();

  // State for which section is active. Default to 'about' for desktop.
  const [activeSection, setActiveSection] = useState('about');

  // Handler for mini-navbar clicks or column clicks (explicit expansion)
  const handleSectionClick = useCallback((sectionName) => {
    // Always set the clicked section as active. No toggle back to 'about' from Andrew/Josh.
    // If clicking the currently active section, it just stays active.
    setActiveSection(sectionName);
  }, []);

  // Helper function to determine column class
  const getColumnClass = useCallback(
    (columnName) => {
      let classes = `interactive-column ${columnName}-column`;
      if (activeSection === columnName) {
        classes += ' is-expanded';
      } else {
        // If it's not the active section, it should be collapsed
        classes += ' is-collapsed';
      }
      return classes;
    },
    [activeSection], // Dependency on activeSection, so it re-runs when active section changes
  );

  return (
    <div className="interactive-about-container">
      <nav className="about-mini-navbar">
        <button
          className={`nav-item ${activeSection === 'andrew' ? 'active' : ''}`}
          onClick={() => handleSectionClick('andrew')}
        >
          Andrew
        </button>
        <button
          className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => handleSectionClick('about')}
        >
          About
        </button>
        <button
          className={`nav-item ${activeSection === 'josh' ? 'active' : ''}`}
          onClick={() => handleSectionClick('josh')}
        >
          Joshua
        </button>
      </nav>

      <div className="interactive-columns-wrapper">
        {/* Andrew Column */}
        <div className={getColumnClass('andrew')} onClick={() => handleSectionClick('andrew')}>
          <div className="column-content">
            {/* Profile Header */}
            <div className="profile-header">
              <img src={owners.andrew} alt="Andrew Royer" className="profile-image" />
              <div className="profile-text">
                <h2>Andrew Royer</h2>
                <p className="profile-role">Founder & Lead Technician</p>
                <p className="profile-tenure">Part of Better State since 2023</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="profile-contact">
              <p>
                Phone: <span className="contact-info">573-823-6325</span>
              </p>
              <p>
                Email: <span className="contact-info">andrew@betterstate.com</span>
              </p>
            </div>

            {/* About Bio */}
            <div className="profile-bio">
              <p>
                Andrew founded Better State in 2023, leveraging over a decade of experience in pool
                maintenance and care. His passion for delivering "Better Pools" drives the company's
                commitment to excellence and customer satisfaction.
              </p>
              <p>
                Andrew's dedication to his craft ensures every pool receives meticulous attention,
                reflecting his commitment to both quality and customer happiness.
              </p>
            </div>

            {/* Enjoyment Pic */}
            <div className="profile-enjoyment-pic">
              <img src={closeup} alt="Andrew working or enjoying" className="enjoyment-image" />
            </div>
          </div>
        </div>

        {/* About Column */}
        <div className={getColumnClass('about')} onClick={() => handleSectionClick('about')}>
          <div className="column-content">
            <div className="section-title">
              <h1>About Us</h1>
            </div>
            <div className="About-Desktop-sec">
                <p className="about-Desk-p">
                Our mission is to ensure every pool in Mid-Missouri is sparkling clean, safe, and a
                source of enjoyment for its owners. We utilize the latest eco-friendly techniques
                and products to minimize environmental impact.
              </p>
              <p className="about-Desk-p">
                Founded in 2023, with over 10 years of experience. Better State is dedicated to
                giving you Better Pools.
              </p>
              <p className="about-Desk-p">
                Proudly serving Mid-Missouri with expert, eco-friendly pool cleaning services.
              </p>
              <p className="about-Desk-p">We are built on Trust, Reliability, and Quality.</p>
            </div>
        
            {activeSection === 'about' && (
              <div className="hidden-details show">
              </div>
            )}
          </div>
        </div>

        {/* Joshua Column */}
        <div className={getColumnClass('josh')} onClick={() => handleSectionClick('josh')}>
          <div className="column-content">
            {/* Profile Header */}
            <div className="profile-header">
              <img src={owners.josh} alt="Joshua Efferson" className="profile-image" />
              <div className="profile-text">
                <h2>Joshua Efferson</h2>
                <p className="profile-role">Operations Manager & Co-founder</p>
                <p className="profile-tenure">Part of Better State since 2023</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="profile-contact">
              <p>
                Phone: <span className="contact-info">XXX-XXX-XXXX</span>
              </p>
              <p>
                Email: <span className="contact-info">joshua@betterstate.com</span>
              </p>
            </div>

            {/* Affiliation Link */}
            <div className="profile-affiliations">
              <p>
                Affiliated with:{' '}
                <a
                  href="https://coatyourpool.com/"
                  className="Othersite-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coat Your Pool
                </a>
              </p>
            </div>

            {/* About Bio */}
            <div className="profile-bio">
              <p>
                Joshua, a proud U.S. Army Veteran, brings discipline and precision to every aspect
                of Better State's operations. His expertise also extends to pool coating through his
                other successful venture, Coat Your Pool, ensuring comprehensive pool solutions.
              </p>
              <p>
                His meticulous approach and leadership are invaluable in maintaining our high
                standards of service.
              </p>
            </div>

            {/* Enjoyment Pic */}
            <div className="profile-enjoyment-pic">
              <img
                src={WhiteBTtruck}
                alt="Joshua working or enjoying"
                className="enjoyment-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
