import { useState } from 'react';
import { addContactSubmission } from '../lib/firestoreService';
import './PageStyles.css';

const Contact = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for the new confirmation checkbox
  const [isConfirmed, setIsConfirmed] = useState(false); // New state for checkbox

  // State for submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the confirmation box is checked before proceeding
    if (!isConfirmed) {
      setSubmitMessage('Please confirm that the information is correct.');
      return; // Stop the submission if not confirmed
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const contactData = {
      name,
      phone,
      email,
      message,
    };

    console.log('Contact form data captured:', contactData);

    try {
      console.log('Attempting to send data to Firestore...');
      await addContactSubmission(contactData);

      setSubmitMessage('Your message has been sent successfully! We will get back to you shortly.');
      console.log('Contact form data successfully sent to Firestore!');

      // Clear form fields on successful submission
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setIsConfirmed(false); // Reset checkbox
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitMessage('Failed to send your message. Please try again.');
      console.log('Failed to send contact form data to Firestore.');
    } finally {
      setIsSubmitting(false);
      console.log('Submission process finished (finally block executed).');
    }
  };

  return (
    <div className="Contact-container">
      <h1>Contact Us</h1>

      <div className="Contact-content">
        <div className="Contact-left">
          <div className="contact-message">
            <h3>Feel free to reach out to us with any questions</h3>
            <p>Email us at betterstatemo@gmail.com</p>
            <p>Call us at 573-826-9529</p>
            <p>Or 573-823-6325</p>
          </div>
        </div>

        <div className="Contact-right">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Name:</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone">Phone:</label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email:</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message:</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="confirm-section">
              {' '}
              {/* Changed div class for better styling */}
              <label className="checkbox-container">
                {' '}
                {/* Label wraps checkbox for clickability */}
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                <span className="checkbox-custom"></span> {/* Custom checkbox styling */}
                By submitting this form, you're confirming that the information above is correct.
              </label>
            </div>

            <button
              className="Submit-btn"
              type="submit"
              disabled={isSubmitting || !isConfirmed || !name || !email || !phone || !message} // Disable if not confirmed or fields are empty
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
            {submitMessage && (
              <p
                className="submit-feedback"
                style={{
                  marginTop: '1rem',
                  color: submitMessage.includes('successfully') ? 'var(--color-accent)' : 'red',
                }}
              >
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
