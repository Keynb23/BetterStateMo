// src/context/ServiceContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for ServiceBtns component
import { useBackendCart } from './BackendCart'; // Added for ServiceBtns and SingleServiceBtn
import { serviceTypes } from './serviceTypes'; // Assuming serviceTypes is also in the context folder or needs a relative path from here
import './ContextStyles.css';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const selectAllServices = (allIds) => {
    setSelectedServices(allIds);
  };

  const clearServices = () => setSelectedServices([]);

  return (
    <ServiceContext.Provider
      value={{
        selectedServices,
        toggleService,
        selectAllServices,
        clearServices,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => useContext(ServiceContext);

// --- START: Merged components from ServiceBtns.jsx ---

// Export SingleServiceBtn so it can be imported by other files
export const SingleServiceBtn = ({ serviceId, serviceTitle }) => {
  // useServiceContext is now local to this file, no need to import it again for these components
  const { selectedServices, toggleService } = useServiceContext();
  const { addService } = useBackendCart();

  const handleClick = () => {
    toggleService(serviceId);
    addService(serviceId);
  };

  const isSelected = selectedServices.includes(serviceId);

  return (
    <button className={`service-btn ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {isSelected ? '✓ ' : ''}
      {isSelected ? `Selected ${serviceTitle}` : `Select ${serviceTitle}`}
    </button>
  );
};

export const ServiceBtns = () => {
  // useServiceContext is now local to this file
  const { selectedServices, selectAllServices, clearServices } = useServiceContext();
  const { addService } = useBackendCart();
  const navigate = useNavigate();

  const handleSelectAll = () => {
    const allIds = serviceTypes.map((service) => service.id);
    const areAllSelected = selectedServices.length === allIds.length;

    if (areAllSelected) {
      clearServices();
    } else {
      selectAllServices(allIds);
      allIds.forEach((id) => addService(id));
    }
  };

  const handleScheduleAppointmentClick = () => {
    navigate('/setapt');
  };

  return (
    <div className="service-btns-container">
      <div className="select-all-btn">
        <button onClick={handleSelectAll}>
          {selectedServices.length === serviceTypes.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {selectedServices.length > 0 && (
        <div className="set-apt-btn">
          <button onClick={handleScheduleAppointmentClick}>Schedule Appointment</button>
        </div>
      )}
    </div>
  );
};

// --- END: Merged components from ServiceBtns.jsx ---