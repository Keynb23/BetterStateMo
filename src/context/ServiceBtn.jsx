// context/ServiceBtns.jsx
import { serviceTypes } from "./serviceTypes";
import { useServiceContext } from "./ServiceContext";
import { useBackendCart } from "./BackendCart"; // Ensure this is correctly implemented or remove if not used
import { useNavigate } from "react-router-dom";
import './ContextStyles.css'

export const ServiceBtns = () => {
  const { selectedServices, selectAllServices, clearServices } = useServiceContext();
  const { addService } = useBackendCart(); // Keeping this as per your previous code

  const navigate = useNavigate();

  // The handleServiceClick function for individual buttons is no longer needed here
  // as SingleServiceBtn.jsx handles individual service clicks.
  // We only need logic for Select All/Deselect All.

  const handleSelectAll = () => {
    const allIds = serviceTypes.map((service) => service.id);
    const areAllSelected = selectedServices.length === allIds.length;

    if (areAllSelected) {
      clearServices(); // Deselect all services in context
      // If addService means adding to backend, you might need a removeAllServices from backend here.
    } else {
      selectAllServices(allIds); // Select all services in context
      // Note: addService is typically for individual services. If selecting all,
      // you might need a batch add or rely on the final appointment confirmation to send all selected.
      // For now, keeping the loop as it was, but consider if this is optimal for a batch operation.
      allIds.forEach((id) => addService(id)); // Backend cart logic for all
    }
  };

  const handleScheduleAppointmentClick = () => {
    navigate("/setapt");
  };

  return (
    <div className="service-btns-container">
      <div className="select-all-btn">
        <button onClick={handleSelectAll}>
          {selectedServices.length === serviceTypes.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* --- REMOVED: The individual service buttons map from here --- */}
      {/*
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
      */}

      {selectedServices.length > 0 && ( // Show "Schedule Appointment" if any service is selected
        <div className="set-apt-btn">
          <button onClick={handleScheduleAppointmentClick}>Schedule Appointment</button>
        </div>
      )}
    </div>
  );
};