import { serviceTypes } from './serviceTypes';
import { useServiceContext } from './ServiceContext';
import { useBackendCart } from './BackendCart';
import { useNavigate } from 'react-router-dom';
import './ContextStyles.css';

// Export SingleServiceBtn so it can be imported by other files
export const SingleServiceBtn = ({ serviceId, serviceTitle }) => { // Changed to export const
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