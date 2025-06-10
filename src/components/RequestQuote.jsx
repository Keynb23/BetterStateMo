import { useState } from "react";

const RequestQuote = () => {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const toggleRequestQuote = () => {
    setIsActive((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle submission logic (API call or integration)
    console.log({ name, number, email, message });

    // Reset and close
    setName("");
    setNumber("");
    setEmail("");
    setMessage("");
    setIsActive(false);
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
                value={number}
                onChange={(e) => setNumber(e.target.value)}
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
              <button type="submit" className="request-quote-submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestQuote;
