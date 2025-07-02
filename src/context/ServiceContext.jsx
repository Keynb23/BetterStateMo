// src/context/ServiceContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackendCart } from './BackendCart';
import { serviceTypes as allServiceTypes } from './serviceTypes';
import './ContextStyles.css';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  // selectedServices will now store the service TITLE (string)
  const [selectedServices, setSelectedServices] = useState([]);

  // toggleService now accepts the serviceTitle (string) directly
  const toggleService = (title) => { // Changed 'id' to 'title'
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((st) => st !== title) : [...prev, title], // Filter by title
    );
  };

  // selectAllServices now accepts an array of serviceTitles (strings)
  const selectAllServices = (allTitles) => { // Changed 'allIds' to 'allTitles'
    setSelectedServices(allTitles);
  };

  const clearServices = () => setSelectedServices([]);

  return (
    <ServiceContext.Provider
      value={{
        selectedServices,
        toggleService,
        selectAllServices,
        clearServices,
        serviceTypes: allServiceTypes, // This is still your source of truth for all service data
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => useContext(ServiceContext);

export const SingleServiceBtn = ({ serviceId, serviceTitle }) => {
  const { selectedServices, toggleService } = useServiceContext();
  const { addService } = useBackendCart(); // Keep this as serviceId for the cart if it expects ID

  const handleClick = () => {
    toggleService(serviceTitle); // <--- IMPORTANT CHANGE: Pass the TITLE (string)
    addService(serviceId); // Keep this as ID if useBackendCart needs the ID
  };

  const isSelected = selectedServices.includes(serviceTitle); // <--- IMPORTANT CHANGE: Check by TITLE (string)

  return (
    <button className={`service-btn ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {isSelected ? '✓ ' : ''}
      {isSelected ? `Selected ${serviceTitle}` : `Select ${serviceTitle}`}
    </button>
  );
};

export const ServiceBtns = () => {
  const { selectedServices, selectAllServices, clearServices, serviceTypes } = useServiceContext();
  const { addService } = useBackendCart(); // This part might still need IDs for the cart

  const handleSelectAll = () => {
    // Get all service NAMES instead of IDs
    const allTitles = serviceTypes.map((service) => service.title); // This is correct, as 'serviceTypes' has 'title'
    const allIds = serviceTypes.map((service) => service.id); // Still need IDs if addService to BackendCart requires them

    const areAllSelected = selectedServices.length === allTitles.length && allTitles.length > 0;

    if (areAllSelected) {
      clearServices();
    } else {
      selectAllServices(allTitles); // <--- IMPORTANT CHANGE: Pass service NAMES (strings)
      allIds.forEach((id) => addService(id)); // Keep this as ID for useBackendCart if necessary
    }
  };

  const handleScheduleAppointmentClick = () => {
    navigate('/setapt');
  };

  const isScheduleButtonDisabled = selectedServices.length === 0;

  return (
    <div className="service-btns-container">
      <div className="select-all-btn">
        <button onClick={handleSelectAll}>
          {selectedServices.length === serviceTypes.length && serviceTypes.length > 0
            ? 'Deselect All'
            : 'Select All'}
        </button>
      </div>

      <div className="set-apt-btn">
        <button
          onClick={handleScheduleAppointmentClick}
          disabled={isScheduleButtonDisabled}
        >
          Schedule Appointment
        </button>
      </div>
    </div>
  );
};