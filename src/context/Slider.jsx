import "./ContextStyles.css";
import { useRef } from "react";
import RequestQuote from "../context/RequestQuote";

const Slider = ({ serviceData, pools }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper" ref={sliderRef}>
        {serviceData.map((service, i) => (
          <div
            key={service.id}
            className="slider-slide"
            style={{
              backgroundImage: `url(${pools[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="slider-content">
                <div className="slider-description">
                    <>
                      <h1>{service.title}</h1>
                      <p>{service.desc}</p>
                      <RequestQuote serviceId={service.title} />
                    </>
                </div>
              </div>
          </div>
        ))}
      </div>

      <div className="slider-arrows">
        <button className="slider-arrow" onClick={scrollLeft}>
          ◀
        </button>
        <button className="slider-arrow" onClick={scrollRight}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default Slider;
