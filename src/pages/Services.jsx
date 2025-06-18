import { useState, useEffect } from "react";
import { useMedia } from "../context/MediaContext";
import RequestQuote from "../context/RequestQuote";
import { ServiceBtns } from "../context/selectServiceBtn";
import "./PageStyles.css";

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

const serviceDataIndexes = [13, 3, 15, 16];

export default function Services() {
  const { pools } = useMedia();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % serviceData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? serviceData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 7000);
    return () => clearInterval(interval);
  }, []);

  const current = serviceData[currentIndex];

  return (
    <>
      <div className="service-carousel-wrapper">
        <div className="service-carousel-slide">
          <img
            src={pools[serviceDataIndexes[currentIndex]]}
            className="service-carousel-img"
            alt={current.title}
          />
          <div className="service-carousel-content">
            <div className="topic">{current.title}</div>
            <div className="description">{current.desc}</div>
            <div className="buttons">
              <RequestQuote serviceId={current.title} />
            </div>
          </div>
        </div>

        <div className="service-carousel-thumbnails">
          {serviceData.map((item, i) => (
            <div
              key={item.id}
              className="thumbnail-item"
              onClick={() => setCurrentIndex(i)}
            >
              <img src={pools[serviceDataIndexes[i]]} alt={item.title} />
              <div className="thumbnail-text">
                <div className="title">{item.title}</div>
                <div className="description">Service</div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-arrows">
          <button onClick={handlePrev}>‹</button>
          <button onClick={handleNext}>›</button>
        </div>

        <div className="carousel-timer" key={currentIndex} />
        <div className="selectService">
          <h2 className="service-subtitle">
            Want to book a service? Select below:
          </h2>
          <ServiceBtns />
        </div>
      </div>
    </>
  );
}
