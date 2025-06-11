import { serviceTypes } from "./serviceTypes";
// IMPORTANT: Destructure the *correct* functions from your ServiceContext
import { useServiceContext } from "./ServiceContext";
import { useBackendCart } from "./BackendCart";
import { useNavigate } from "react-router-dom";

export const ServiceBtns = () => {
  // CORRECTED: Destructure toggleService, selectAllServices, and clearServices
  // setSelectedServices is NOT provided by your ServiceContext directly.
  const { selectedServices, toggleService, selectAllServices } = useServiceContext();
  const { addService } = useBackendCart();
  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    // Use the toggleService from your context
    toggleService(serviceId);

    // Keep your backend cart logic as is
    addService(serviceId);
  };

  const handleSetAptClick = () => {
    navigate("/setapt");
  };

  const handleSelectAll = () => {
    const allIds = serviceTypes.map((service) => service.id);
    // Use the selectAllServices from your context
    selectAllServices(allIds);

    // Keep your backend cart logic as is
    allIds.forEach((id) => addService(id));
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
            {selectedServices.includes(service.id) ? "✓ " : ""}
            {service.title}
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