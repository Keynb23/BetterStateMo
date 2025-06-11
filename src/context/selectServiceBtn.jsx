import { serviceTypes } from "./serviceTypes";
import { useServiceContext } from "./ServiceContext";
import { useNavigate } from "react-router-dom";

export const ServiceBtns = () => {
  const { selectedServices, setSelectedServices } = useServiceContext();
  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSetAptClick = () => {
    navigate("/setapt");
  };

  const handleSelectAll = () => {
    const allIds = serviceTypes.map((service) => service.id);
    setSelectedServices(allIds);
  };

  return (
    <div className="service-btns-container">
      <div className="select-all-btn">
        <button onClick={handleSelectAll}>Select All</button>
      </div>

      <div className="select-ind-btns">
        {serviceTypes.map((service) => (
          <button
            key={service.id}
            className={`service-btn ${
              selectedServices.includes(service.id) ? "selected" : ""
            }`}
            onClick={() => handleServiceClick(service.id)}
          >
            {selectedServices.includes(service.id) ? "✓ " : ""}{service.title}
          </button>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="set-apt-btn">
          <button onClick={handleSetAptClick}>Set Appointment</button>
        </div>
      )}
    </div>
  );
};

