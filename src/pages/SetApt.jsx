// pages/SetApt.jsx
import { useServiceContext } from "../context/ServiceContext";
import { serviceTypes } from "../context/serviceTypes";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addAppointment } from "../lib/firestoreService"; // Ensure this path is correct
import "./PageStyles.css"; // Make sure this is linked

// Import react-datepicker and its CSS
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SetApt = () => {
  const { selectedServices, toggleService, clearServices } =
    useServiceContext(); // Added clearServices here for potential reset on unmount/redirect
  const navigate = useNavigate();
  const location = useLocation();

  // State for the current step in the appointment wizard
  const [currentStep, setCurrentStep] = useState(0); // 0: Contact, 1: Date/Time, 2: Services, 3: Review
  const [earlyContact, setEarlyContact] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Initialize state variables
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [customerName, setCustomerName] = useState(""); // Initialize with empty string
  const [customerPhone, setCustomerPhone] = useState(""); // Initialize with empty string
  const [customerEmail, setCustomerEmail] = useState(""); // Initialize with empty string
  const [customerAddress, setCustomerAddress] = useState(""); // Initialize with empty string

  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      const { customerInfo } = location.state;
      setCustomerName(customerInfo.name || "");
      setCustomerEmail(customerInfo.email || "");
      setCustomerPhone(customerInfo.phone || "");
      setCustomerAddress(customerInfo.address || "");
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
      date: appointmentDate ? appointmentDate.toISOString().split("T")[0] : "", // e.g., "YYYY-MM-DD"
      time: appointmentTime,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: customerAddress,
      createdAt: new Date(),
    };

    try {
      const appointmentId = await addAppointment(appointmentData);
      console.log(
        "Appointment successfully saved to Firebase with ID:",
        appointmentId
      );

      setShowThankYou(true);
      // Stay on thank you page for 10 seconds
      setTimeout(() => {
        navigate("/");
        setShowThankYou(false);
        // Reset form fields after successful submission and redirection
        setAppointmentDate(null);
        setAppointmentTime("");
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setCustomerAddress("");
        clearServices(); // Clear selected services from context after appointment
      }, 10000); // 10 seconds
    } catch (error) {
      console.error("Failed to save appointment:", error);
      alert(
        "There was an error scheduling your appointment. Please try again."
      );
    }
  };

  // --- Navigation Handlers ---
  const handleNext = () => {
    // Basic validation before moving to the next step
    if (currentStep === 0) {
      // Contact Info step
      if (
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        !customerAddress
      ) {
        alert("Please fill in all your contact information.");
        return;
      }
    } else if (currentStep === 1) {
      // Date/Time step
      if (!appointmentDate || !appointmentTime) {
        alert("Please select a date and time for your appointment.");
        return;
      }
    } else if (currentStep === 2) {
      // Services step
      if (selectedServices.length === 0) {
        alert("Please select at least one service.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Helper to render the current step
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
      case 1: // Date and Time Selection
        return (
          <div className="Set-Apt-step-card">
            <h2>When works best for you?</h2>
            <p className="Set-Apt-step-prompt">
              Choose your preferred date and time for the service.
            </p>
            <div className="calender">
              <label>Preferred Date</label>
              <DatePicker
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className="custom-datepicker-input"
                minDate={new Date()}
                showPopperArrow={false}
              />
            </div>
            <div className="TimeofDay">
              <label>Preferred Time of Day</label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="">Select a time</option>
                <option value="morning">Morning (8 AM - 12 PM)</option>
                <option value="noon">Noon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>
        );
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
                  <p className="no-services-message">
                    No services selected yet. Add some below!
                  </p>
                ) : (
                  <ul>
                    {selectedServices.map((id) => {
                      const service = serviceTypes.find((s) => s.id === id);
                      return (
                        <li key={id}>
                          <span>{service?.title}</span>
                          <button
                            onClick={() => handleRemoveService(id)}
                            className="remove-btn"
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
                  <div className="unselected-service-btns">
                    {serviceTypes
                      .filter(
                        (service) => !selectedServices.includes(service.id)
                      )
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
            <p className="Set-Apt-step-prompt">
              Please review all the details before confirming.
            </p>

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
                <strong>Date:</strong>{" "}
                {appointmentDate
                  ? appointmentDate.toLocaleDateString("en-US")
                  : "N/A"}
              </p>
              <p>
                <strong>Time:</strong> {appointmentTime}
              </p>
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
                className={earlyContact ? "Early-contact-btn-clicked" : ""}
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
        // This div handles the centering of the thank-you message
        <div className="thank-you-overlay">
          <div className="thank-you-message Set-Apt-step-card">
            <h2 className="thank-you-title">
              Thank you for scheduling your appointment!
            </h2>
            <p className="thank-you-text">
              You will be redirected to the home page shortly.
            </p>
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
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  className="Set-Apt-nav-button next-button"
                >
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
