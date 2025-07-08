import { useAppointmentLogic } from './AptLogic';
import { serviceTypes } from '../../context/serviceTypes';
import './AptStyles.css';


const SetApt = () => {
  const {
    currentStep,
    earlyContact,
    setEarlyContact,
    showThankYou,
    isSubmitting,
    errorMessage,
    formErrors,
    schedulingPreference,
    setSchedulingPreference,
    appointmentTime,
    setAppointmentTime,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    customerAddress,
    setCustomerAddress,
    handleNext,
    handleBack,
    handleAddService,
    handleRemoveService,
    handleConfirmAppointment,
    selectedServices,
  } = useAppointmentLogic();

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
              <p className="error-message" role="alert">
                {errorMessage}
              </p>
            )}
            <div className="services-selection-container">
              <div className="services-selected-apt">
                <h3>Selected Services ({selectedServices.length})</h3>
                {selectedServices.length === 0 ? (
                  <p className="no-services-message">No services selected yet. Add some below!</p>
                ) : (
                  <ul aria-label="Selected Services">
                    {selectedServices.map((serviceTitle) => {
                      const service = serviceTypes.find((s) => s.title === serviceTitle);
                      return (
                        <li key={serviceTitle}>
                          <span>{service?.title || serviceTitle}</span>
                          <button
                            onClick={() => handleRemoveService(serviceTitle)}
                            className="remove-btn"
                            aria-label={`Remove ${service?.title || serviceTitle}`}
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
                  <div
                    className="unselected-service-btns"
                    role="group"
                    aria-label="Available Services to Add"
                  >
                    {serviceTypes
                      .filter((service) => !selectedServices.includes(service.title))
                      .map((service) => (
                        <button
                          key={service.id}
                          className="service-btn"
                          onClick={() => handleAddService(service.title)}
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
              <p className="error-message" role="alert">
                {errorMessage}
              </p>
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
                  {selectedServices.map((serviceTitle) => {
                    return <li key={serviceTitle}>{serviceTitle}</li>;
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
