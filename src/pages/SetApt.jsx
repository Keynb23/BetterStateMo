import { useServiceContext } from "../context/ServiceContext";
import { serviceTypes } from "../context/serviceTypes";
import { useState } from "react";

const SetApt = () => {
  const { selectedServices, setSelectedServices } = useServiceContext();
  const [earlyContact, setEarlyContact] = useState(false);

  const handleAddService = (id) => {
    if (!selectedServices.includes(id)) {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleRemoveService = (id) => {
    setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
  };

  return (
    <div className="Set-Apt-container">
      <div className="greetings-checker">
        <h1>Let's get you scheduled!</h1>
      </div>

      <div className="calender">
        <h2>What days work best for you?</h2>
        {/* Calendar placeholder */}
        <input type="date" />
      </div>

      <div className="TimeofDay">
        <h2>What time?</h2>
        <select>
          <option value="">Select a time</option>
          <option value="morning">Morning</option>
          <option value="noon">Noon</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <div className="customer-apt-info">
        <h2>Your Contact Information</h2>
        <form>
          <label>Name</label>
          <input type="text" placeholder="John Doe" />

          <label>Phone Number</label>
          <input type="tel" placeholder="(123) 456-7890" />

          <label>Email</label>
          <input type="email" placeholder="you@email.com" />

          <label>Address</label>
          <input type="text" placeholder="123 Street Name, City" />
        </form>
      </div>

      <div className="services-selected-apt">
        <h2>Services Selected:</h2>
        <ul>
          {selectedServices.map((id) => {
            const service = serviceTypes.find(s => s.id === id);
            return (
              <li key={id}>
                {service?.title}
                <button onClick={() => handleRemoveService(id)} className="remove-btn">X</button>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedServices.length < serviceTypes.length && (
        <div className="add-another-service">
          <h3>Add Another Service</h3>
          <div className="unselected-service-btns">
            {serviceTypes
              .filter(service => !selectedServices.includes(service.id))
              .map(service => (
                <button
                  key={service.id}
                  className="service-btn"
                  onClick={() => handleAddService(service.id)}
                >
                  {service.title}
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="Early-contact-prompt">
        <button
          id="Early-contact-btn"
          onClick={() => setEarlyContact(!earlyContact)}
        >
          ✔
        </button>
        <p>Please contact me if there is an earlier date available.</p>
      </div>
    </div>
  );
};

export default SetApt;
