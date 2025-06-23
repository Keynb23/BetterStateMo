import { serviceTypes } from "./serviceTypes";
import { useServiceContext } from "./ServiceContext";
import { useBackendCart } from "./BackendCart"; // Ensure this is correctly implemented or remove if not used
import { useNavigate } from "react-router-dom";
import './ContextStyles.css'

export const ServiceBtns = () => {
  const { selectedServices, selectAllServices, clearServices } = useServiceContext();
  const { addService } = useBackendCart(); // Keeping this as per your previous code

  const navigate = useNavigate();

  const handleSelectAll = () => {
    const allIds = serviceTypes.map((service) => service.id);
    const areAllSelected = selectedServices.length === allIds.length;

    if (areAllSelected) {
      clearServices(); // Deselect all services in context
    } else {
      selectAllServices(allIds); // Select all services in context
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

      {selectedServices.length > 0 && ( // Show "Schedule Appointment" if any service is selected
        <div className="set-apt-btn">
          <button onClick={handleScheduleAppointmentClick}>Schedule Appointment</button>
        </div>
      )}
    </div>
  );
};