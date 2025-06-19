import "./PageStyles.css";
import { useMedia } from "../context/MediaContext";
import RequestQuote from "../context/RequestQuote";
import SingleServiceBtn from "../context/SingleServiceBtn";

const serviceData = [
  {
    id: "c1",
    title: "Pool Cleaning",
    desc: "Our comprehensive pool cleaning services ensure your pool remains sparkling and healthy.",
    index: 13,
  },
  {
    id: "c2",
    title: "Pool Servicing",
    desc: "From minor repairs to major equipment overhauls, our expert technicians can handle it.",
    index: 3,
  },
  {
    id: "c3",
    title: "Open your pool",
    desc: "Get your pool ready for swimming with our seasonal opening service.",
    index: 15,
  },
  {
    id: "c4",
    title: "Closing your pool",
    desc: "Protect your investment with our full winterization service.",
    index: 16,
  },
];

const Service = () => {
  const { pools } = useMedia();

  return (
    <div className="service-container">
      <h1 className="services-main-title">Services</h1>
      <div className="service-content">
        {serviceData.map((service) => (
          <div key={service.id} className="ServiceCard">
            <img
              src={pools[service.index]}
              alt={service.title}
              className="ServiceCard-image"
            />
            <h2 className="ServiceCard-title">{service.title}</h2>
            <p className="ServiceCard-description">{service.desc}</p>
      <div className="service-card-btns">
        <div className="rq-btn">
          <RequestQuote serviceId={service.title} />
        </div>
        <div className="SS-btn">
          <SingleServiceBtn serviceId={service.title} />
        </div>
      </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
