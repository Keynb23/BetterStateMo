import './PageStyles.css';
import { useMedia } from '../context/MediaContext';
// RequestQuote import is kept for reference, but it's removed from render
import RequestQuote from '../context/RequestQuote';
// Import useServiceContext to manage menu item selection
import { ServiceBtns, SingleServiceBtn, useServiceContext } from '../context/ServiceContext';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper modules
import { Navigation, Pagination, A11y } from 'swiper/modules'; // Navigation module is back!

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Navigation styles are back!
import 'swiper/css/pagination'; // For pagination dots


const serviceData = [
  {
    id: 1,
    title: 'Pool Opening',
    index: 20,
    desc: 'Get your pool ready for summer with our comprehensive pool opening service, ensuring a clean and safe start to your swimming season.',
  },
  {
    id: 2,
    title: 'Pool Closing',
    index: 5,
    desc: 'Protect your pool during the off-season with our professional closing service, preparing it for winter and preventing costly damage.',
  },
  {
    id: 3,
    title: 'Pool Services',
    index: 28,
    desc: 'Maintain pristine water quality and optimal equipment performance with our regular pool servicing, tailored to your needs.',
  },
];

const Service = () => {
  const { pools } = useMedia();
  // Access selectedServices and toggleService from the ServiceContext
  const { toggleService, selectedServices } = useServiceContext();

  return (
    <section id="services" className="service-container">
      <h1 className="services-main-title">Our Pool Services</h1>

      {/* Moved sub-header content for better structural grouping */}
      <div className="service-sub-header">
        <div className="note">
          THIS IS KEYN. I stepped away to get food. I see what this looks like lmao
        </div>
        <p className="service-subP">
          We provide professional pool maintenance, cleaning, and repairs to keep your water clear
          and equipment running right. From weekly service to green pool recovery. Our licensed
          team handles it all with care and precision.
        </p>
        <h4 className="service-subH4">Enjoy your pool - we'll handle the rest.</h4>
      </div>

      {/* New main container for the menu and service cards */}
      <div className="Service-main-content">
        <div className="service-menu-items">
          <ul className="service-menu-list">
            {/* These list items will be linked to the service IDs,
                can be clicked to select the service, and will be highlighted when active/selected */}
            {serviceData.map((service) => (
              <li
                key={service.id}
                className={`service-menu-item ${selectedServices.includes(service.id) ? 'active-menu-item' : ''}`}
                onClick={() => toggleService(service.id)} // Click to select/deselect service
              >
                {service.title}
              </li>
            ))}
          </ul>
          <ul className="Service-menu-btns">
            {/* The Select all services and schedule service appointment buttons will go here.
                The ServiceBtns component renders these based on context. */}
            <ServiceBtns />
          </ul>
        </div>

        {/* This is the carousel container */}
        <div className="services-list-wrapper">
          <Swiper
            // Install modules (Navigation is back for explicit control)
            modules={[Navigation, Pagination, A11y]}
            // Default settings for smallest screens
            slidesPerView={1.1} // Shows 1 full card and 10% of the next
            spaceBetween={16} // space-md (adjust in CSS if needed)
            navigation={true} // Enable next/prev buttons
            pagination={{ clickable: true }} // Enable pagination dots, clickable
            loop={true} // Enable looping through slides
            grabCursor={true} // Show grab cursor for draggable slides
            // Responsive breakpoints
            breakpoints={{
              // When window width is >= 768px (Tablet)
              768: {
                slidesPerView: 2.1, // Shows 2 full cards and 10% of the next
                spaceBetween: 24, // Adjust for larger screens
              },
              // When window width is >= 1280px (Desktop)
              1280: {
                slidesPerView: 3, // Shows all 3 full cards (no peek if exactly 3)
                spaceBetween: 32, // Adjust for desktop
              },
            }}
          >
            {serviceData.map((service) => (
              <SwiperSlide key={service.id}>
                <div className="service-item">
                  <div className="service-item-content">
                    <h2 className="service-item-title">{service.title}</h2>
                    {/* This could be the background for the whole card */}
                    <div className="service-item-image-container">
                      <img
                        src={pools[service.index]}
                        alt={service.title}
                        className="service-item-image"
                      />
                    </div>
                    {/* A solid black background here. Doesn't have to be black, but black for now */}
                    <p className="service-item-description">{service.desc}</p>
                    <div className="service-item-btns">
                      <div className="SS-btn">
                        <SingleServiceBtn serviceId={service.id} serviceTitle={service.title} />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Service;