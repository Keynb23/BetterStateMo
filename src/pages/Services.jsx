import { useState } from "react";
import { useMedia } from "../context/MediaContext";
import RequestQuote from "../components/RequestQuote";

const serviceDataIndexes = [18, 17, 14, 11];

const serviceData = [
  {
    id: "c1",
    title: "Pool Cleaning",
    desc: "Our comprehensive pool cleaning services ensure your pool remains sparkling and healthy. We handle everything from skimming and vacuuming to water chemistry balancing.",
  },
  {
    id: "c2",
    title: "Pool Servicing",
    desc: "From minor repairs to major equipment overhauls, our expert technicians can diagnose and fix any issue, keeping your pool running efficiently all season long.",
  },
  {
    id: "c3",
    title: "Open your pool",
    desc: "Get your pool ready for the swimming season with our professional opening services. We'll clean, balance, and inspect your pool to ensure a smooth and enjoyable start.",
  },
  {
    id: "c4",
    title: "Closing your pool",
    desc: "Protect your investment during the off-season with our thorough pool closing services. We'll winterize your pool to prevent damage and ensure an easy opening next year.",
  },
];

export default function Services() {
  const { pools } = useMedia();
  const [selectedId, setSelectedId] = useState("c1");

  return (
    <div className="Service-wrapper">
      <h1 className="services-main-title">Our Services</h1>
      <div className="Service-container">
        {serviceData.map((service, i) => (
          <div
            className={`service-slide${selectedId === service.id ? " active" : ""}`}
            key={service.id}
            onClick={() => setSelectedId(service.id)}
            style={{
              backgroundImage: `url(${pools[serviceDataIndexes[i]]})`,
            }}
            aria-label={service.title}
          >
            <div className="slide-content">
              <div className="slide-description">
                {selectedId === service.id && (
                  <>
                    <h4>{service.title}</h4>
                    <p>{service.desc}</p>
                    <RequestQuote serviceId={service.id} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="Service-cards-names">
        {serviceData.map(({ id, title }) => (
          <label
            key={id}
            className={`service-name-label${selectedId === id ? " active" : ""}`}
            onClick={() => setSelectedId(id)}
          >
            {title}
          </label>
        ))}
      </div>
    </div>
  );
}