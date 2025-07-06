import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServiceContext } from '../../context/ServiceContext'; 
import { addAppointment } from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';

// Custom hook to encapsulate all appointment logic
export const useAppointmentLogic = () => {
  const { selectedServices, toggleService, clearServices } = useServiceContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

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

  // Effect to pre-fill customer info if passed via location state
  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      const { customerInfo } = location.state;
      setCustomerName(customerInfo.name || '');
      setCustomerEmail(customerInfo.email || '');
      setCustomerPhone(customerInfo.phone || '');
      setCustomerAddress(customerInfo.address || '');
    }
  }, [location.state]);

  // Handler for moving to the next step
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
        // Attempt to focus the first error field for better UX
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
  }, [
    currentStep,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    selectedServices.length,
  ]);

  // Handler for moving to the previous step
  const handleBack = useCallback(() => {
    setErrorMessage('');
    setFormErrors({});
    setCurrentStep((prev) => prev - 1);
  }, []);

  // Handler for adding/removing a service (uses toggleService from context)
  const handleAddService = useCallback(
    (serviceTitle) => {
      toggleService(serviceTitle);
      setErrorMessage(''); // Clear service selection error if present
    },
    [toggleService],
  );

  // Handler for removing a service (also uses toggleService)
  const handleRemoveService = useCallback(
    (serviceTitle) => {
      toggleService(serviceTitle);
    },
    [toggleService],
  );

  // Handler for confirming and submitting the appointment
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

    // Conditionally add userId if a user is logged in
    if (currentUser) {
      appointmentData.userId = currentUser.uid;
      // Save their email for convenience
      appointmentData.userEmail = currentUser.email;
    }

    try {
      const appointmentId = await addAppointment(appointmentData);
      console.log('Appointment successfully saved to Firebase with ID:', appointmentId);

      setShowThankYou(true);
      window.scrollTo(0, 0); // Scroll to top to show thank you message

      // Redirect after timeout and reset form states
      setTimeout(() => {
        navigate('/');
        setShowThankYou(false);
        setSchedulingPreference('');
        setAppointmentTime('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setCustomerAddress('');
        clearServices(); // Clear selected services from context
      }, REDIRECT_TIMEOUT);
    } catch (error) {
      console.error('Failed to save appointment:', error);
      setErrorMessage('There was an error scheduling your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedServices,
    earlyContact,
    schedulingPreference,
    appointmentTime,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    navigate,
    clearServices,
    currentUser,
  ]);

  // Effect for handling keyboard (Enter key) navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission

        // If currently on an input field in step 0 and it's the last input, move to next step
        if (event.target.tagName === 'INPUT' && event.target.type !== 'submit') {
          if (currentStep === 0) {
            const inputs = Array.from(document.querySelectorAll('.customer-apt-info-form input'));
            const lastInput = inputs[inputs.length - 1];
            if (event.target === lastInput) {
              handleNext();
              return;
            }
          }
          // For other inputs, just allow default behavior (e.g., moving to next input)
          return;
        }

        // Handle navigation for other steps
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

  // Return all states and handlers needed by the UI component
  return {
    currentStep,
    setCurrentStep,
    earlyContact,
    setEarlyContact,
    showThankYou,
    setShowThankYou,
    isSubmitting,
    setIsSubmitting,
    errorMessage,
    setErrorMessage,
    formErrors,
    setFormErrors,
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
    selectedServices, // Provided by ServiceContext, but re-exported for convenience
  };
};
