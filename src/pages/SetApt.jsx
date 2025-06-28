import { useServiceContext } from '../context/ServiceContext';
import { serviceTypes } from '../context/serviceTypes';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addAppointment } from '../lib/firestoreService';
import './PageStyles.css';

const SetApt = () => {
  const { selectedServices, toggleService, clearServices } = useServiceContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [earlyContact, setEarlyContact] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [schedulingPreference, setSchedulingPreference] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      const { customerInfo } = location.state;
      setCustomerName(customerInfo.name || '');
      setCustomerEmail(customerInfo.email || '');
      setCustomerPhone(customerInfo.phone || '');
      setCustomerAddress(customerInfo.address || '');
    }
  }, [location.state]);

  const handleAddService = (id) => {
    toggleService(id);
  };

  const handleRemoveService = (id) => {
    toggleService(id);
  };

  const handleConfirmAppointment = async () => {
    const appointmentData = {
      selectedServices: selectedServices,
      earlyContact: earlyContact,
      schedulingPreference: schedulingPreference || null,
      time: appointmentTime || null,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: customerAddress,
      createdAt: new Date(),
    };

    try {
      const appointmentId = await addAppointment(appointmentData);
      console.log('Appointment successfully saved to Firebase with ID:', appointmentId);

      setShowThankYou(true);
      window.scrollTo(0, 0); // Scroll to top when thank you message appears
      setTimeout(() => {
        navigate('/');
        setShowThankYou(false);
        setSchedulingPreference('');
        setAppointmentTime('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerAddress('');
        clearServices();
      }, 7000); // 7 seconds
    } catch (error) {
      console.error('Failed to save appointment:', error);
      alert('There was an error scheduling your appointment. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        alert('Please fill in all your contact information.');
        return;
      }
    } else if (currentStep === 2) {
      if (selectedServices.length === 0) {
        alert('Please select at least one service.');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // NEW useEffect for handling "Enter" key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if the pressed key is 'Enter'
      if (event.key === 'Enter') {
        // Prevent the default browser behavior (e.g., submitting a form if an input is focused)
        event.preventDefault();

        // Determine which action to take based on the current step
        if (currentStep < 3) {
          // If not on the last step, trigger the "Next" action
          handleNext();
        } else if (currentStep === 3) {
          // If on the last step (Review and Confirm), trigger the "Confirm Appointment" action
          handleConfirmAppointment();
        }
        // No action for 'Back' on Enter key
      }
    };

    // Attach the event listener to the document when the component mounts
    document.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component unmounts or dependencies change
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentStep, handleNext, handleConfirmAppointment]); // Dependencies: ensure the effect re-runs if these values change

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Contact Information Form
        return (
          <div className="Set-Apt-step-card">
            <h2>Your Contact Information</h2>
            <p className="Set-Apt-step-prompt">
              Let's start with your details so we can get in touch!
            </p>
            <form className="customer-apt-info-form">
              <label>Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="(123) 456-7890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />

              <label>Address</label>
              <input
                type="text"
                placeholder="123 Street Name, City, State"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />
            </form>
          </div>
        );
      case 1: {
        // How soon and Time of Day Selection
        const schedulingOptions = [
          { value: '1-2-weeks', label: '1 - 2 weeks' },
          { value: '1-month', label: '1 month' },
          { value: '3-months', label: '3 months' },
          { value: 'unsure', label: 'Unsure' },
        ];

        const timeOptions = [
          { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
          { value: 'noon', label: 'Noon (12 PM - 4 PM)' },
          { value: 'evening', label: 'Evening (4 PM - 8 PM)' },
        ];
        return (
          <div className="Set-Apt-step-card">
            <h2>When works best for you?</h2>
            <p className="Set-Apt-step-prompt">
              Please indicate how soon you'd like your service, and your preferred time of day.
            </p>

            <div className="scheduling-preference-section">
              <label>How soon would you like your service scheduled?</label>
              <div className="time-options-buttons">
                {schedulingOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`time-option-btn ${
                      schedulingPreference === option.value ? 'selected' : ''
                    }`}
                    onClick={() => setSchedulingPreference(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
                {schedulingPreference && (
                  <button
                    className="time-option-btn clear-time-btn"
                    onClick={() => setSchedulingPreference('')}
                  >
                    Clear Preference
                  </button>
                )}
              </div>
            </div>

            <div className="TimeofDay">
              <label>Preferred Time of Day (Optional)</label>
              <div className="time-options-buttons">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`time-option-btn ${
                      appointmentTime === option.value ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setAppointmentTime(option.value === appointmentTime ? '' : option.value)
                    }
                  >
                    {option.label}
                  </button>
                ))}
                {appointmentTime && (
                  <button
                    className="time-option-btn clear-time-btn"
                    onClick={() => setAppointmentTime('')}
                  >
                    Clear Time
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 2: // Services Selection
        return (
          <div className="Set-Apt-step-card">
            <h2>What services do you need?</h2>
            <p className="Set-Apt-step-prompt">
              Select the services you'd like to include in your appointment.
            </p>
            <div className="services-selection-container">
              <div className="services-selected-apt">
                <h3>Selected Services ({selectedServices.length})</h3>
                {selectedServices.length === 0 ? (
                  <p className="no-services-message">No services selected yet. Add some below!</p>
                ) : (
                  <ul>
                    {selectedServices.map((id) => {
                      const service = serviceTypes.find((s) => s.id === id);
                      return (
                        <li key={id}>
                          <span>{service?.title}</span>
                          <button onClick={() => handleRemoveService(id)} className="remove-btn">
                            X
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {selectedServices.length < serviceTypes.length && (
                <div className="add-another-service">
                  <h3>Available Services</h3>
                  <div className="unselected-service-btns">
                    {serviceTypes
                      .filter((service) => !selectedServices.includes(service.id))
                      .map((service) => (
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
            </div>
          </div>
        );
      case 3: // Review and Confirm
        return (
          <div className="Set-Apt-step-card review-step-card">
            <h2>Review Your Appointment</h2>
            <p className="Set-Apt-step-prompt">Please review all the details before confirming.</p>

            <div className="review-section">
              <h3>Contact Information</h3>
              <p>
                <strong>Name:</strong> {customerName}
              </p>
              <p>
                <strong>Phone:</strong> {customerPhone}
              </p>
              <p>
                <strong>Email:</strong> {customerEmail}
              </p>
              <p>
                <strong>Address:</strong> {customerAddress}
              </p>
            </div>

            <div className="review-section">
              <h3>Appointment Details</h3>
              <p>
                <strong>Scheduling Preference:</strong> {schedulingPreference || 'Not specified'}
              </p>
              <p>
                <strong>Preferred Time of Day:</strong> {appointmentTime || 'Not specified'}
              </p>
              {!(schedulingPreference || appointmentTime) && (
                <p className="no-preference-message-review">
                  No specific scheduling or time preference. We will contact you to arrange a
                  suitable time.
                </p>
              )}
            </div>

            <div className="review-section">
              <h3>Selected Services</h3>
              {selectedServices.length === 0 ? (
                <p>No services selected.</p>
              ) : (
                <ul>
                  {selectedServices.map((id) => {
                    const service = serviceTypes.find((s) => s.id === id);
                    return <li key={id}>{service?.title}</li>;
                  })}
                </ul>
              )}
            </div>

            <div className="Early-contact-prompt">
              <button
                id="Early-contact-btn"
                className={earlyContact ? 'Early-contact-btn-clicked' : ''}
                onClick={() => setEarlyContact(!earlyContact)}
              >
                ✔
              </button>
              <p>Please contact me if there is an earlier date available.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Set-Apt-container">
      {showThankYou ? (
        <div className="thank-you-overlay">
          <div className="thank-you-message Set-Apt-step-card">
            <h2 className="thank-you-title">Thank you for scheduling your appointment!</h2>
            <p className="thank-you-text">You will be redirected to the home page shortly.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="greetings-checker">
            <h1>Let's get you scheduled!</h1>
          </div>

          <div className="Set-Apt-content-wrapper">
            {renderStep()}

            <div className="Set-Apt-navigation">
              {currentStep > 0 && (
                <button onClick={handleBack} className="Set-Apt-nav-button back-button">
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button onClick={handleNext} className="Set-Apt-nav-button next-button">
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={handleConfirmAppointment}
                  className="Set-Apt-nav-button confirm-button"
                >
                  Confirm Appointment
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SetApt;