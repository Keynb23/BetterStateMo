// context/BackendCart.jsx
import { createContext, useContext, useState } from "react";
import { serviceTypes } from "./serviceTypes";

const BackendCartContext = createContext();

export const BackendCartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addService = (id) => {
    if (!cart.includes(id)) setCart((prev) => [...prev, id]);
  };

  const removeService = (id) => {
    setCart((prev) => prev.filter((serviceId) => serviceId !== id));
  };

  const clearCart = () => setCart([]);

  const getSelectedTitles = () =>
    cart.map((id) => serviceTypes.find((s) => s.id === id)?.title || "Unknown");

  return (
    <BackendCartContext.Provider
      value={{ cart, addService, removeService, clearCart, getSelectedTitles }}
    >
      {children}
    </BackendCartContext.Provider>
  );
};

export const useBackendCart = () => useContext(BackendCartContext);
