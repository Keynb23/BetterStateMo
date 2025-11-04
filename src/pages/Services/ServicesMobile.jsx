// /pages/Services/ServicesMobile.jsx
import { useState, useCallback, useRef } from 'react';
import { SingleServiceBtn, ServiceBtns } from '../../context/ServiceContext';
import snowflakelight from '../../assets/icons/snowflake-light.png';
import sunny from '../../assets/icons/sunny.png';
import wrenchgeardark from '../../assets/icons/wrench-gear.png';
import './ServiceMobile.css';

const serviceData = [
  {
    id: 1,
    title: 'Pool Opening',
    icon: sunny,
    desc: 'Get your pool ready for summer with our comprehensive pool opening service, ensuring a clean and safe start to your swimming season.',
    features: [
      'Remove winter cover',
      'Start up pump and filter',
      'Test and balance water chemistry',
      'Brush pool walls and floor',
      'Initial vacuuming and skimming',
    ],
  },
  {
    id: 2,
    title: 'Pool Closing',
    icon: snowflakelight,
    desc: 'Protect your pool during the off-season with our professional closing service, preparing it for winter and preventing costly damage.',
    features: [
      'Drain water to winterizing level',
      'Blow out and plug lines',
      'Remove and store accessories',
      'Apply winterizing chemicals',
      'Install winter cover',
    ],
  },
  {
    id: 3,
    title: 'Pool Maintenance',
    icon: wrenchgeardark,
    desc: 'Maintain pristine water quality and optimal equipment performance with our regular pool servicing, tailored to your needs.',
    features: [
      'Full-service weekly/bi-weekly cleaning',
      'Water testing and chemical balancing',
      'Equipment inspection and maintenance',
      'Skimming and vacuuming',
      'Filter cleaning and backwashing',
    ],
  },
];

export default function ServicesMobile() {
  const sectionOrder = serviceData.map((service) => service.title);
  const [activeSection, setActiveSection] = useState('Pool Closing');
  const touchStartX = useRef(0);
  const touchStartY = useRef(0); // Add Y coordinate tracking
  const SWIPE_X_THRESHOLD = 50; // Minimum horizontal distance for a swipe
  const SWIPE_Y_THRESHOLD = 30; // Maximum allowed vertical deviation for a horizontal swipe (reduce if needed)
  const handleSectionClick = useCallback((sectionName) => {
    setActiveSection(sectionName);
  }, []);
  // Touch start event handler
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY; // Store initial Y
  }, []);
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
    <section id="services-mobile" className="SM-service-mobile-container">
      <h1 className="SM-services-main-title">Our Pool Services</h1>
      <nav className="SM-Mobile-Service-navbar">
        {serviceData.map((service) => (
          <button
            key={service.id}
            className={`SM-nav-item ${activeSection === service.title ? 'active' : ''}`}
            onClick={() => handleSectionClick(service.title)}
          >
            {service.title}
          </button>
        ))}
      </nav>

      <div
        className="SM-mobile-Service-card-display"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render all service cards here, and apply 'active-card' based on state */}
        {serviceData.map((service) => (
          <div
            key={service.id}
            className={`SM-service-item-content ${
              activeSection === service.title ? 'SM-active-card' : ''
            }`}
          >
            <div className="SM-service-item-header">
              <img src={service.icon} alt={service.title} className="SM-service-icon" />
              <h2 className="SM-service-item-title">{service.title}</h2>
            </div>
            <p className="SM-service-item-description">{service.desc}</p>
            <ul className="SM-service-features-list">
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="SM-service-item-btns">
              <SingleServiceBtn serviceId={service.id} serviceTitle={service.title} />
            </div>
          </div>
        ))}
      </div>

      <div className="SM-Service-global-btns-container">
        <ServiceBtns />
      </div>
    </section>
  );
}