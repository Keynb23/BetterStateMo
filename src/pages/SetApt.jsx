// SetApt.jsx (Relevant section for changes)
import { useServiceContext } from "../context/ServiceContext";
import { serviceTypes } from "../context/serviceTypes";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { addAppointment } from '../lib/firestoreService'; // <-- Import the new function

const SetApt = () => {
  const { selectedServices, toggleService } = useServiceContext(); // assuming you went with Option 2 and removed setSelectedServices directly
  const [earlyContact, setEarlyContact] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();

  // Add state for your form inputs
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');


  // ... (handleAddService and handleRemoveService remain as in your Option 2 choice)
  const handleAddService = (id) => {
    toggleService(id);
    console.log(`Service with id ${id} added/toggled.`);
  };

  const handleRemoveService = (id) => {
    toggleService(id);
    console.log(`Service with id ${id} removed/toggled.`);
  };


  const handleConfirmAppointment = async () => { // Make this function async
    const appointmentData = {
      selectedServices: selectedServices,
      earlyContact: earlyContact,
      date: appointmentDate,
      time: appointmentTime,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: customerAddress,
      // Add any other data you want to save
    };

    try {
      // Send data to Firebase
      const appointmentId = await addAppointment(appointmentData);
      console.log("Appointment successfully saved to Firebase with ID:", appointmentId);

      // Display thank you message and redirect
      setShowThankYou(true);
      setTimeout(() => {
        navigate('/');
        setShowThankYou(false);
        // Optionally clear form fields after successful submission
        setAppointmentDate('');
        setAppointmentTime('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerAddress('');
        // You might also want to clear selected services from context if needed
        // clearServices(); // If you imported clearServices from context
      }, 2000);

    } catch (error) {
      console.error("Failed to save appointment:", error);
      // Handle the error, e.g., display an error message to the user
      alert("There was an error scheduling your appointment. Please try again.");
    }
  };

  return (
    <div className="Set-Apt-container">
      {showThankYou ? (
        <div className="thank-you-message">
          <h2>Thank you for scheduling your appointment!</h2>
          <p>You will be redirected to the home page shortly.</p>
        </div>
      ) : (
        <>
          <div className="greetings-checker">
            <h1>Let's get you scheduled!</h1>
          </div>

          <div className="calender">
            <h2>What days work best for you?</h2>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div className="TimeofDay">
            <h2>What time?</h2>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            >
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
              <input
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="(123) 456-7890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />

              <label>Address</label>
              <input
                type="text"
                placeholder="123 Street Name, City"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
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
                      onClick={() => handleAddService(service.id)}>
                      {service.title}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="Early-contact-prompt">
            <button
              id="Early-contact-btn"
              onClick={() => {
                setEarlyContact(!earlyContact);
                console.log("Early contact button clicked, new state:", !earlyContact);
              }}
            >✔</button>
            <p>Please contact me if there is an earlier date available.</p>
          </div>

          <div className="confirmapt-btn">
            <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SetApt;