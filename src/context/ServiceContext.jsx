// ServiceContext.jsx
import { createContext, useContext, useState } from 'react';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAllServices = (allIds) => {
    setSelectedServices(allIds);
  };

  const clearServices = () => setSelectedServices([]);

  return (
    <ServiceContext.Provider value={{
      selectedServices,
      toggleService,
      selectAllServices,
      clearServices
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => useContext(ServiceContext);
