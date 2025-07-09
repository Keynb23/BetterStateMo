// src/pages/About/AboutMobile.jsx
import { useState, useCallback, useRef } from 'react';
import { useMedia } from '../context/MediaContext';
import closeup from '../assets/Trucks/closeup.jpg';
import WhiteBTtruck from '../assets/Trucks/blackClose.jpg';
import './AboutStyles.css';

export default function AboutMobile() {
  const { owners } = useMedia();

  // Define the order of sections for swiping
  const sectionOrder = ['andrew', 'about', 'josh'];

  // State for which section is active. Default to 'about' on load.
  const [activeSection, setActiveSection] = useState('about');

  // Refs to store the starting X and Y positions of a touch
  const touchStartX = useRef(0);
  const touchStartY = useRef(0); // Add Y coordinate tracking

  // Thresholds for swipe detection
  const SWIPE_X_THRESHOLD = 50; // Minimum horizontal distance for a swipe
  const SWIPE_Y_THRESHOLD = 30; // Maximum allowed vertical deviation for a horizontal swipe (reduce if needed)

  // Handler for mini-navbar clicks
  const handleSectionClick = useCallback((sectionName) => {
    setActiveSection(sectionName);
  }, []);

  // Touch start event handler
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY; // Store initial Y
  }, []);

  // Touch move event handler (optional, but can be used to prevent scrolling if you want a pure horizontal swipe)
  // For now, we'll just handle it in touchEnd. If you want to disable vertical scrolling during a potential swipe,
  // you'd add e.preventDefault() here based on logic.
  // const handleTouchMove = useCallback((e) => {
  //     const currentX = e.touches[0].clientX;
  //     const currentY = e.touches[0].clientY;
  //     const diffX = Math.abs(currentX - touchStartX.current);
  //     const diffY = Math.abs(currentY - touchStartY.current);

  //     // If horizontal movement is greater than vertical movement, prevent default scrolling
  //     if (diffX > diffY && diffX > 10) { // Small threshold to start preventing
  //         e.preventDefault();
  //     }
  // }, []);

  // Touch end event handler
  const handleTouchEnd = useCallback(
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY; // Get final Y position

      const diffX = touchEndX - touchStartX.current; // Horizontal difference
      const diffY = touchEndY - touchStartY.current; // Vertical difference

      // Calculate absolute differences for comparison
      const absDiffX = Math.abs(diffX);
      const absDiffY = Math.abs(diffY);

      // Determine if it's primarily a horizontal swipe
      // horizontal movement must exceed SWIPE_X_THRESHOLD
      // AND horizontal movement must be significantly greater than vertical movement
      // AND vertical movement must be within SWIPE_Y_THRESHOLD
      if (
        absDiffX > SWIPE_X_THRESHOLD &&
        absDiffX > absDiffY * 1.5 &&
        absDiffY < SWIPE_Y_THRESHOLD
      ) {
        // Added absDiffX > absDiffY * 1.5 and absDiffY < SWIPE_Y_THRESHOLD
        const currentIndex = sectionOrder.indexOf(activeSection);

        if (diffX > 0) {
          // Swiped right (previous)
          if (currentIndex > 0) {
            setActiveSection(sectionOrder[currentIndex - 1]);
          }
        } else {
          // Swiped left (next)
          if (currentIndex < sectionOrder.length - 1) {
            setActiveSection(sectionOrder[currentIndex + 1]);
          }
        }
      }
    },
    [activeSection, sectionOrder],
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

      {/* Mobile-specific container for the single active column */}
      <div
        className="mobile-column-display"
        onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove} // Uncomment if you want to prevent vertical scroll during potential swipe
        onTouchEnd={handleTouchEnd}
      >
        {activeSection === 'andrew' && (
          <div className="mobile-section andrew-section">
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
                  Andrew founded Better State in 2023, leveraging over a decade of experience in
                  pool maintenance and care. His passion for delivering "Better Pools" drives the
                  company's commitment to excellence and customer satisfaction.
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
        )}

        {activeSection === 'about' && (
          <div className="mobile-section about-section">
            <div className="column-content">
              <div className="section-title">
                <h1>About Us</h1>
              </div>
              <p className="about-sec-p">
                Our mission is to ensure every pool in Mid-Missouri is sparkling clean, safe, and a
                source of enjoyment for its owners. We utilize the latest eco-friendly techniques
                and products to minimize environmental impact.
              </p>
              <p className="about-sec-p">
                Founded in 2023, with over 10 years of experience. Better State is dedicated to
                giving you Better Pools.
              </p>
              <p className="about-sec-p">
                Proudly serving Mid-Missouri with expert, eco-friendly pool cleaning services.
              </p>
              <p className="about-sec-p">We are built on Trust, Reliability, and Quality.</p>
              <div className="hidden-details show"></div>
            </div>
          </div>
        )}

        {activeSection === 'josh' && (
          <div className="mobile-section josh-section">
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
                  of Better State's operations. His expertise also extends to pool coating through
                  his other successful venture, Coat Your Pool, ensuring comprehensive pool
                  solutions.
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
        )}
      </div>
    </div>
  );
}
