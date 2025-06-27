// pages/Service.jsx
import './PageStyles.css';
import { useMedia } from '../context/MediaContext';
import RequestQuote from '../context/RequestQuote'; // Keep the import
import SingleServiceBtn from '../context/SingleServiceBtn';
import { ServiceBtns } from '../context/ServiceBtn';

const serviceData = [
  {
    id: 1,
    title: 'Pool Opening',
    index: 9,
    desc: 'Get your pool ready for summer with our comprehensive pool opening service, ensuring a clean and safe start to your swimming season.',
  },
  {
    id: 2,
    title: 'Pool Closing',
    index: 2,
    desc: 'Protect your pool during the off-season with our professional closing service, preparing it for winter and preventing costly damage.',
  },
  {
    id: 3,
    title: 'Pool Services',
    index: 6,
    desc: 'Maintain pristine water quality and optimal equipment performance with our regular pool servicing, tailored to your needs.',
  },
];

const Service = () => {
  const { pools } = useMedia();

  return (
    <section id="services" className="service-container">
      <h1 className="services-main-title">Our Pool Services</h1>
      <div className="service-sub-header">
        <p>
          We provide professional pool maintenance, cleaning, and repairs to keep your water clear
          and equipment running right.
        </p>
        <p>From weekly service to green pool recovery.</p>
        <p>Our licensed team handles it all with care and precision.</p>
        <h4>Enjoy your pool - we'll handle the rest.</h4>
      </div>

      <div className="services-list-wrapper">
        {serviceData.map((service) => (
          <div key={service.id} className="service-item">
            <div className="service-item-image-container">
              <img src={pools[service.index]} alt={service.title} className="service-item-image" />
            </div>
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
        ))}
      </div>

      <ServiceBtns />

      <RequestQuote />
    </section>
  );
};

export default Service;
