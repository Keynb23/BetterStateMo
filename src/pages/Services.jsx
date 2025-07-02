import './PageStyles.css';
import { useMedia } from '../context/MediaContext';
import { ServiceBtns, SingleServiceBtn, useServiceContext } from '../context/ServiceContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
      <div className="service-sub-header">
        <p className="service-subP">
          We provide professional pool maintenance, cleaning, and repairs to keep your water clear
          and equipment running right. From weekly service to green pool recovery. Our licensed
          team handles it all with care and precision.
        </p>
        <h4 className="service-subH4">Enjoy your pool - we'll handle the rest.</h4>
      </div>

      {/* NEW CONTAINER for the main body content (menu + carousel) */}
      <div className="services-body-content">
        {/* LEFT SIDE: Service Menu */}
        <div className="Service-main-content"> {/* This now only holds the menu items */}
          <div className="service-menu-items">
            <ul className="service-menu-list">

              {serviceData.map((service) => (
                <li
                  key={service.id}
                  className={`service-menu-item ${selectedServices.includes(service.id) ? 'active-menu-item' : ''}`}
                  onClick={() => toggleService(service.id)}
                >
                  {service.title}
                </li>
              ))}
            </ul>
            <ul className="Service-menu-btns">
              <ServiceBtns />
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE: Services List (Carousel) */}
        <div className="services-list-wrapper">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            // Default settings for smallest screens (0px up to 767px)
            slidesPerView={1.1} // Shows 1 full card and a small peek of the next
            spaceBetween={16}
            navigation={true}
            pagination={{ clickable: true }}
            loop={true}
            grabCursor={true}
            // Responsive breakpoints - Swiper uses min-width logic
            breakpoints={{
              // When window width is >= 768px (Tablet)
              768: {
                slidesPerView: 1.2, // Shows 1 full card and a bit more of the next
                spaceBetween: 12,
              },
              // When window width is >= 1024px (Smaller Desktop)
              1024: {
                slidesPerView: 1.3, // Shows 1 full card and an even larger peek
                spaceBetween: 14,
              },
              // When window width is >= 1280px (Large Desktop)
              1280: {
                slidesPerView: 1.4, // Consistent peek effect on larger screens
                spaceBetween: 16,
              },
            }}
          >
            {serviceData.map((service) => (
              <SwiperSlide key={service.id}>
                <div className="service-item">
                  {/* Image container placed directly inside service-item */}
                  <div className="service-item-image-container">
                    <img
                      src={pools[service.index]}
                      alt={service.title}
                      className="service-item-image"
                    />
                  </div>
                  {/* Content container now overlays the image */}
                  <div className="service-item-content">
                    <h2 className="service-item-title">{service.title}</h2>
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