// /pages/Services/Services.jsx
import { useState } from 'react';
import { SingleServiceBtn, ServiceBtns, useServiceContext } from '../../context/ServiceContext';
import './Services.css'; 
import snowflakelight from '../../assets/icons/snowflake-light.png';
import sunny from '../../assets/icons/sunny.png';
import wrenchgeardark from '../../assets/icons/wrench-gear.png';

// Service Data
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

// Service Component
const Service = () => {
 const { toggleService, selectedServices } = useServiceContext();
 const [hoveredServiceId, setHoveredServiceId] = useState(null);

 return (
  <section id="services" className="service-container">
   <h1 className="services-main-title">Our Pool Services</h1>
   
   {/* Mobile Scroll Hint (Hidden on Desktop/Tablet by CSS) */}
   <p className="service-mobile-text">
    Scroll down to schedule your appointment
   </p>
   <div className="services-body-content">

    {/* Mini Navbar - New for Desktop/Tablet */}
    <nav className="Mobile-Service-navbar">
     {serviceData.map((service) => (
      <button
       key={service.id}
       className="nav-item"
       onClick={() => {
        const cardElement = document.getElementById(`service-card-${service.id}`);
        if (cardElement) {
         cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
       }}
      >
       {service.title}
      </button>
     ))}
    </nav>

    {/* Service Cards Wrapper */}
    <div className="service-details-wrapper">
     {serviceData.map((service) => (
      <div
       key={service.id}
       id={`service-card-${service.id}`} // Added ID for scrolling
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