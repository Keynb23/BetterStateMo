import { useState } from 'react';
import { SingleServiceBtn, ServiceBtns, useServiceContext } from '../../context/ServiceContext';
import './Services.css'; 
// import snowflakedark from '../assets/icons/snowflake-dark.png';
import snowflakelight from '../../assets/icons/snowflake-light.png';
import sunny from '../../assets/icons/sunny.png';
// import wrenchgearlight from '../assets/icons/wrench-gear-light.png';
import wrenchgeardark from '../../assets/icons/wrench-gear.png';

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

const Service = () => {
  const { toggleService, selectedServices } = useServiceContext();
  const [hoveredServiceId, setHoveredServiceId] = useState(null);

  return (
    <section id="services" className="service-container">
      <h1 className="services-main-title">Our Pool Services</h1>
      
      {/* This is the service-mobile-text you were asking about */}
      <p className="service-mobile-text">
        Scroll down to schedule your appointment
      </p>
      <div className="services-body-content">
        <div className="Service-main-content">
          <p className="Service-menuP">
            We provide professional pool maintenance, cleaning, and repairs to keep your water clear
            and equipment running right. From weekly service to green pool recovery. Our licensed
            team handles it all with care and precision.
          </p>

          {/* This was the second H4 you added in the previous turn, before I tried to "fix" it */}
          <div className="service-sub-mobile"><h3>
            Enjoy your pool - we'll handle the rest</h3></div>
          <div className="service-menu-items">
            <ul className="service-menu-list">
              {serviceData.map((service) => (
                <li
                  key={service.id}
                  className={`service-menu-item ${
                    selectedServices.includes(service.id) ? 'active-menu-item' : ''
                  }
                  ${hoveredServiceId === service.id ? 'highlighted-menu-item' : ''}`}
                  onClick={() => toggleService(service.id)}
                >
                  {service.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="service-details-wrapper">
          {serviceData.map((service) => (
            <div
              key={service.id}
              className={`service-item-card ${
                selectedServices.includes(service.id) ? 'selected-card' : ''
              }`}
              onMouseEnter={() => setHoveredServiceId(service.id)}
              onMouseLeave={() => setHoveredServiceId(null)}
            >
              <div className="service-item-header">
                {service.icon && (
                  <img src={service.icon} alt={service.title} className="service-icon" />
                )}
                <h2 className="service-item-title">{service.title}</h2>
              </div>
              <p className="service-item-description">{service.desc}</p>
              {service.features && service.features.length > 0 && (
                <ul className="service-features-list">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
              <div className="service-item-btns">
                <SingleServiceBtn serviceId={service.id} serviceTitle={service.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="Service-global-btns-container">
        <ServiceBtns />
      </div>
    </section>
  );
};

export default Service;