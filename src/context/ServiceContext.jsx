// src/context/ServiceContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep this import
import { useBackendCart } from './BackendCart';
import { serviceTypes as allServiceTypes } from './serviceTypes';
import './ContextStyles.css';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  // selectedServices will now store the service TITLE (string)
  const [selectedServices, setSelectedServices] = useState([]);

  // toggleService now accepts the serviceTitle (string) directly
  const toggleService = (title) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((st) => st !== title) : [...prev, title],
    );
  };

  // selectAllServices now accepts an array of serviceTitles (strings)
  const selectAllServices = (allTitles) => {
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
  const { addService } = useBackendCart();

  const handleClick = () => {
    toggleService(serviceTitle);
    addService(serviceId);
  };

  const isSelected = selectedServices.includes(serviceTitle);

  return (
    <button className={`service-btn ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {isSelected ? '✓ ' : ''}
      {isSelected ? `Selected ${serviceTitle}` : `Select ${serviceTitle}`}
    </button>
  );
};

export const ServiceBtns = () => {
  // Call useNavigate INSIDE the functional component
  const navigate = useNavigate(); // <--- ADD THIS LINE

  const { selectedServices, selectAllServices, clearServices, serviceTypes } = useServiceContext();
  const { addService } = useBackendCart();

  const handleSelectAll = () => {
    const allTitles = serviceTypes.map((service) => service.title);
    const allIds = serviceTypes.map((service) => service.id);

    const areAllSelected = selectedServices.length === allTitles.length && allTitles.length > 0;

    if (areAllSelected) {
      clearServices();
    } else {
      selectAllServices(allTitles);
      allIds.forEach((id) => addService(id));
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