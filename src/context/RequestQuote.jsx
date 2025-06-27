// context/RequestQuote.jsx
import { useState } from 'react';
import { useBackendCart } from './BackendCart';
import { addQuoteRequest } from '../lib/firestoreService';
import './ContextStyles.css';
import servicequote from '../assets/service-quote.png';

const RequestQuote = ({ serviceId = null }) => {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const { addService } = useBackendCart();

  // Handles opening/closing the quote request modal
  const toggleRequestQuote = () => {
    setIsActive((prev) => {
      const newState = !prev;
      if (newState && serviceId) {
        addService(serviceId);
      }
      return newState;
    });
    if (!isActive) {
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmitMessage('');
    }
  };

  // Handles the submission of the quote request form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const quoteData = {
      name,
      phone,
      email,
      message,
      serviceId: serviceId,
      createdAt: new Date(),
    };

    try {
      await addQuoteRequest(quoteData);
      setSubmitMessage('Your quote request has been sent! We will contact you soon.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setIsActive(false);
        setSubmitMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting quote request:', error);
      setSubmitMessage('Failed to send your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quote-button-fixed-container">
      <button className="quote-button-image" onClick={toggleRequestQuote}>
        <img src={servicequote} alt="Request a Quote" />
      </button>

      {isActive && (
        <div className="quote-modal-overlay">
          <div className="quote-request-modal">
            <button className="quote-modal-close-button" onClick={toggleRequestQuote}>
              &times;
            </button>

            <div className="quote-modal-header-image">
              <img src={servicequote} alt="Service Quote Icon" />
            </div>

            <h2 className="quote-modal-title">Request a Quote</h2>

            <form onSubmit={handleSubmit} className="quote-request-form">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="quote-form-input"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="quote-form-input"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="quote-form-input"
                required
              />
              <textarea
                rows={4}
                placeholder="Tell us what you need..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="quote-form-textarea"
              />
              <button type="submit" className="quote-form-submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              {submitMessage && <p className="quote-form-feedback-message">{submitMessage}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestQuote;
