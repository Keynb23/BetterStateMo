import { useState } from 'react';
import { addContactSubmission } from '../lib/firestoreService'; // New import for contact submissions
import './ComponentStyles.css'

const Contact = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setIsSubmitting(true); // Disable button and show loading indicator
    setSubmitMessage(''); // Clear previous messages

    const contactData = {
      name,
      phone,
      email,
      message,
    };

    try {
      // Call the Firestore service to add the contact submission
      await addContactSubmission(contactData);
      setSubmitMessage('Your message has been sent successfully! We will get back to you shortly.');
      // Clear form fields on successful submission
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitMessage('Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button
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
          {/* Wrap inputs in a form element and attach onSubmit handler */}
          <form onSubmit={handleSubmit}>
            <div className="form-group"> {/* Added for better organization */}
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

            <div className="confirm-btns">
              <p>
                By submitting this form, you're confirming that the information
                above is correct.
              </p>
              <button
                className="Submit-btn"
                type="submit" // Set type to submit for form submission
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
              {submitMessage && (
                <p className="submit-feedback" style={{ marginTop: '1rem', color: submitMessage.includes('successfully') ? 'green' : 'red' }}>
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
