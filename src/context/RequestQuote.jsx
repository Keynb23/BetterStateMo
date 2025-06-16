import { useState } from "react";
import { useBackendCart } from "./BackendCart"; // Assuming this is for selected services for apt, not direct quote
import { addQuoteRequest } from '../lib/firestoreService'; // New import for quote requests
import './ContextStyles.css'

const RequestQuote = ({ serviceId }) => {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Renamed from 'number' for consistency with contact form
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [submitMessage, setSubmitMessage] = useState(''); // New state for feedback

  const { addService } = useBackendCart(); // This seems to be for backend cart, likely for appointment booking, not direct quote.

  const toggleRequestQuote = () => {
    setIsActive((prev) => {
      const newState = !prev;
      // This part adds service to backend cart. Keep this if it's intended
      // that requesting a quote for a specific service also adds it to a "cart".
      // If it's *only* for quotes, you might want to remove this or clarify its purpose.
      if (newState && serviceId) {
        addService(serviceId);
      }
      return newState;
    });
    // Clear form fields when opening the modal
    if (!isActive) {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Disable button
    setSubmitMessage(''); // Clear previous messages

    const quoteData = {
      name,
      phone, // Use the state variable for phone
      email,
      message,
      serviceId: serviceId || null, // Include serviceId if provided to the component
    };

    try {
      // Call the Firestore service to add the quote request
      await addQuoteRequest(quoteData);
      setSubmitMessage('Your quote request has been sent! We will contact you soon.');
      // Clear form fields on successful submission
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      // Close the modal after successful submission
      setTimeout(() => { // Give user time to see success message
        setIsActive(false);
        setSubmitMessage(''); // Clear message after closing
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      setSubmitMessage('Failed to send your request. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <>
      <button className="request-quote-button" onClick={toggleRequestQuote}>
        Request a Quote
      </button>

      {isActive && (
        <div className="request-quote-overlay">
          <div className="request-quote-modal">
            <button className="request-quote-close" onClick={toggleRequestQuote}>
              &times;
            </button>

            <h2 className="text-2xl mb-4 font-semibold">Request a Quote</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="request-quote-input"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="request-quote-input"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="request-quote-input"
                required
              />
              <textarea
                rows={4}
                placeholder="Tell us what you need..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="request-quote-textarea"
              />
              <button type="submit" className="request-quote-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              {submitMessage && (
                <p className="submit-feedback" style={{ marginTop: '1rem', textAlign: 'center', color: submitMessage.includes('successfully') ? 'green' : 'red' }}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestQuote;
