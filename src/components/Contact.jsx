const Contact = () => {
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
          <section>
            <label>Name:</label>
            <input type="text" />

            <label>Phone:</label>
            <input type="tel" />

            <label>Email:</label>
            <input type="email" />

            <label>Message:</label>
            <textarea></textarea>
          </section>

          <div className="confirm-btns">
            <p>
              By submitting this form, you're confirming that the information
              above is correct.
            </p>
            <button className="Submit-btn">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
