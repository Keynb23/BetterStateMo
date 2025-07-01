import { useServiceContext } from '../context/ServiceContext';
import { serviceTypes } from '../context/serviceTypes';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addAppointment } from '../lib/firestoreService';
import './PageStyles.css';
import { useAuth } from '../context/AuthContext'; // Added: Import useAuth hook

const SetApt = () => {
  const { selectedServices, toggleService, clearServices } = useServiceContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth(); // Added: Get the currently authenticated user

  const [currentStep, setCurrentStep] = useState(0);
  const [earlyContact, setEarlyContact] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [schedulingPreference, setSchedulingPreference] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Constants
  const REDIRECT_TIMEOUT = 7000; // 7 seconds

  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      const { customerInfo } = location.state;
      setCustomerName(customerInfo.name || '');
      setCustomerEmail(customerInfo.email || '');
      setCustomerPhone(customerInfo.phone || '');
      setCustomerAddress(customerInfo.address || '');
    }
  }, [location.state]);

  const handleNext = useCallback(() => {
    setErrorMessage('');
    setFormErrors({});

    if (currentStep === 0) {
      const errors = {};
      if (!customerName) errors.name = 'Name is required.';
      if (!customerEmail) errors.email = 'Email is required.';
      if (!customerPhone) errors.phone = 'Phone number is required.';
      if (!customerAddress) errors.address = 'Address is required.';

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        const firstErrorField = Object.keys(errors)[0];
        document.querySelector(`input[name="${firstErrorField}"]`)?.focus();
        return;
      }
    } else if (currentStep === 2) {
      if (selectedServices.length === 0) {
        setErrorMessage('Please select at least one service.');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, customerName, customerEmail, customerPhone, customerAddress, selectedServices.length]);

  const handleBack = useCallback(() => {
    setErrorMessage('');
    setFormErrors({});
    setCurrentStep((prev) => prev - 1);
  }, []);

  const handleAddService = useCallback((id) => {
    toggleService(id);
    setErrorMessage('');
  }, [toggleService]);

  const handleRemoveService = useCallback((id) => {
    toggleService(id);
  }, [toggleService]);

  const handleConfirmAppointment = useCallback(async () => {
    if (selectedServices.length === 0) {
      setErrorMessage('Please select at least one service before confirming.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

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

    // Added: Conditionally add userId if a user is logged in
    if (currentUser) {
        appointmentData.userId = currentUser.uid;
        // Optionally, you could also save their email for convenience
        // appointmentData.userEmail = currentUser.email;
    }

    try {
      const appointmentId = await addAppointment(appointmentData);
      console.log('Appointment successfully saved to Firebase with ID:', appointmentId);

      setShowThankYou(true);
      window.scrollTo(0, 0);

      setTimeout(() => {
        navigate('/');
        setShowThankYou(false);
        // Reset all form states after successful submission and navigation
        setSchedulingPreference('');
        setAppointmentTime('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerAddress('');
        clearServices();
      }, REDIRECT_TIMEOUT);
    } catch (error) {
      console.error('Failed to save appointment:', error);
      setErrorMessage('There was an error scheduling your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedServices, earlyContact, schedulingPreference, appointmentTime, customerName, customerPhone, customerEmail, customerAddress, navigate, clearServices, currentUser]); // Added currentUser to dependencies

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (event.target.tagName === 'INPUT' && event.target.type !== 'submit') {
          if (currentStep === 0) {
            const inputs = Array.from(document.querySelectorAll('.customer-apt-info-form input'));
            const lastInput = inputs[inputs.length - 1];
            if (event.target === lastInput) {
              handleNext();
              return;
            }
          }
          return;
        }

        if (currentStep < 3) {
          handleNext();
        } else if (currentStep === 3 && !isSubmitting) {
          handleConfirmAppointment();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentStep, handleNext, handleConfirmAppointment, isSubmitting]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="Set-Apt-step-card" aria-live="polite">
              <h2>Your Contact Information</h2>
              <p className="Set-Apt-step-prompt">
                Let's start with your details so we can get in touch!
              </p>
              <form className="customer-apt-info-form">
                <label htmlFor="customerName">Name</label>
                <input
                  id="customerName"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? 'error-name' : undefined}
                  required
                />
                {formErrors.name && (
                  <p id="error-name" className="error-message" role="alert">
                    {formErrors.name}
                  </p>
                )}

                <label htmlFor="customerPhone">Phone Number</label>
                <input
                  id="customerPhone"
                  name="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? 'error-phone' : undefined}
                  required
                />
                {formErrors.phone && (
                  <p id="error-phone" className="error-message" role="alert">
                    {formErrors.phone}
                  </p>
                )}

                <label htmlFor="customerEmail">Email</label>
                <input
                  id="customerEmail"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? 'error-email' : undefined}
                  required
                />
                {formErrors.email && (
                  <p id="error-email" className="error-message" role="alert">
                    {formErrors.email}
                  </p>
                )}

                <label htmlFor="customerAddress">Address</label>
                <input
                  id="customerAddress"
                  name="address"
                  type="text"
                  placeholder="123 Street Name, City, State"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  aria-invalid={!!formErrors.address}
                  aria-describedby={formErrors.address ? 'error-address' : undefined}
                  required
                />
                {formErrors.address && (
                  <p id="error-address" className="error-message" role="alert">
                    {formErrors.address}
                  </p>
                )}
              </form>
            </div>
          </>
        );
      case 1: {
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
          <div className="Set-Apt-step-card" aria-live="polite">
            <h2>When works best for you?</h2>
            <p className="Set-Apt-step-prompt">
              Please indicate how soon you'd like your service, and your preferred time of day.
            </p>

            <div className="scheduling-preference-section">
              <label>How soon would you like your service scheduled?</label>
              <div className="time-options-buttons" role="group" aria-label="Scheduling Preference">
                {schedulingOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`time-option-btn ${
                      schedulingPreference === option.value ? 'selected' : ''
                    }`}
                    onClick={() => setSchedulingPreference(option.value)}
                    aria-pressed={schedulingPreference === option.value}
                  >
                    {option.label}
                  </button>
                ))}
                {schedulingPreference && (
                  <button
                    className="time-option-btn clear-time-btn"
                    onClick={() => setSchedulingPreference('')}
                    aria-label="Clear Scheduling Preference"
                  >
                    Clear Preference
                  </button>
                )}
              </div>
            </div>

            <div className="TimeofDay">
              <label>Preferred Time of Day (Optional)</label>
              <div className="time-options-buttons" role="group" aria-label="Preferred Time of Day">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`time-option-btn ${
                      appointmentTime === option.value ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setAppointmentTime(option.value === appointmentTime ? '' : option.value)
                    }
                    aria-pressed={appointmentTime === option.value}
                  >
                    {option.label}
                  </button>
                ))}
                {appointmentTime && (
                  <button
                    className="time-option-btn clear-time-btn"
                    onClick={() => setAppointmentTime('')}
                    aria-label="Clear Preferred Time of Day"
                  >
                    Clear Time
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 2:
        return (
          <div className="Set-Apt-step-card" aria-live="polite">
            <h2>What services do you need?</h2>
            <p className="Set-Apt-step-prompt">
              Select the services you'd like to include in your appointment.
            </p>
            {errorMessage && (
                <p className="error-message" role="alert">{errorMessage}</p>
            )}
            <div className="services-selection-container">
              <div className="services-selected-apt">
                <h3>Selected Services ({selectedServices.length})</h3>
                {selectedServices.length === 0 ? (
                  <p className="no-services-message">No services selected yet. Add some below!</p>
                ) : (
                  <ul aria-label="Selected Services">
                    {selectedServices.map((id) => {
                      const service = serviceTypes.find((s) => s.id === id);
                      return (
                        <li key={id}>
                          <span>{service?.title}</span>
                          <button
                            onClick={() => handleRemoveService(id)}
                            className="remove-btn"
                            aria-label={`Remove ${service?.title}`}
                          >
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
                  <div className="unselected-service-btns" role="group" aria-label="Available Services to Add">
                    {serviceTypes
                      .filter((service) => !selectedServices.includes(service.id))
                      .map((service) => (
                        <button
                          key={service.id}
                          className="service-btn"
                          onClick={() => handleAddService(service.id)}
                          aria-label={`Add ${service.title}`}
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
      case 3:
        return (
          <div className="Set-Apt-step-card review-step-card" aria-live="polite">
            <h2>Review Your Appointment</h2>
            <p className="Set-Apt-step-prompt">Please review all the details before confirming.</p>
            {errorMessage && (
                <p className="error-message" role="alert">{errorMessage}</p>
            )}

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
                <ul aria-label="Confirmed Selected Services">
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
                aria-pressed={earlyContact}
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
        <div className="thank-you-overlay" role="status" aria-live="assertive">
          <div className="thank-you-message Set-Apt-step-card">
            <h2 className="thank-you-title">Thank you for scheduling your appointment!</h2>
            <p className="thank-you-text">You will be redirected to the home page shortly.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="greetings-checker">
            <h1>Let's get you scheduled!</h1>
            <p className="step-indicator">Step {currentStep + 1} of 4</p>
          </div>

          <div className="Set-Apt-content-wrapper">
            {renderStep()}

            <div className="Set-Apt-navigation">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="Set-Apt-nav-button back-button"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  className="Set-Apt-nav-button next-button"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={handleConfirmAppointment}
                  className="Set-Apt-nav-button confirm-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Appointment'}
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