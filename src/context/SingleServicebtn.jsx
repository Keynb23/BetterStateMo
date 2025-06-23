// context/SingleServiceBtn.jsx
import { useServiceContext } from "./ServiceContext";
import { useBackendCart } from "./BackendCart"; // Ensure this is correctly implemented or remove if not used
import "./ContextStyles.css";

const SingleServiceBtn = ({ serviceId, serviceTitle }) => {
  const { selectedServices, toggleService } = useServiceContext();
  const { addService } = useBackendCart(); // Keeping this as per your previous code

  const handleClick = () => {
    toggleService(serviceId);
    // Decide if addService should happen on every click or only on final confirmation
    // For now, keeping it here as per your original structure.
    addService(serviceId);
  };

  const isSelected = selectedServices.includes(serviceId);

  return (
    <button
      className={`service-btn ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      {isSelected ? "✓ " : ""}
      {isSelected ? `Selected ${serviceTitle}` : `Select ${serviceTitle}`}
    </button>
  );
};

export default SingleServiceBtn;