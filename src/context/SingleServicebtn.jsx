// context/SingleServiceBtn.jsx
import { useServiceContext } from "./ServiceContext";
import { useBackendCart } from "./BackendCart";
import "./ContextStyles.css"; // use existing styles

const SingleServiceBtn = ({ serviceId }) => {
  const { selectedServices, toggleService } = useServiceContext();
  const { addService } = useBackendCart();

  const handleClick = () => {
    toggleService(serviceId);
    addService(serviceId);
  };

  const isSelected = selectedServices.includes(serviceId);

  return (
    <button
      className={`service-btn ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      {isSelected ? "✓ " : ""}
      Select Service
    </button>
  );
};

export default SingleServiceBtn;
