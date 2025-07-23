// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const fs = require('fs'); // Node.js File System module
const path = require('path'); // Node.js Path module

admin.initializeApp();

// --- Nodemailer Transporter Setup ---
let mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
});

const FRIEND_EMAIL = 'YOUR_FRIENDS_BUSINESS_EMAIL@example.com'; // <--- REPLACE THIS WITH YOUR ACTUAL EMAIL!
const LOGO_URL = '../src/assets/owners/Logo.png'; 

// Read the CSS file content once when the function is initialized
let emailCss = '';
try {
  // Adjust the path based on where you save functions_email_styles.css
  // For example, if it's directly in the 'functions' folder:
  const cssFilePath = path.join(__dirname, 'functions_email_styles.css');
  // If it's in 'functions/email/'
  // const cssFilePath = path.join(__dirname, 'email', 'functions_email_styles.css');
  
  emailCss = fs.readFileSync(cssFilePath, 'utf8');
  console.log('Successfully loaded email CSS styles.');
} catch (error) {
  console.error('Error loading email CSS file:', error);
  // It's critical to have styles, so you might want to throw or handle this more robustly
  // Or fall back to inline styles if this fails.
}


/**
 * Helper function to generate the common HTML structure for emails.
 * It injects the CSS and includes the logo and basic layout.
 * @param {string} subjectLine - The main title for the email.
 * @param {string} bodyContent - The specific HTML content for the email's body.
 * @returns {string} The complete HTML string for the email.
 */
function generateEmailHtml(subjectLine, bodyContent) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subjectLine}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
      <style>
        /* Embedded CSS from functions_email_styles.css */
        ${emailCss}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${LOGO_URL}" alt="Better State LLC Logo" class="logo">
          <h1 class="title">${subjectLine}</h1>
        </div>
        
        ${bodyContent}
        
        <div class="footer">
          <p>Best regards,<br>The Better State LLC Team</p>
          <p>&copy; ${new Date().getFullYear()} Better State LLC. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Cloud Function to send an email when a new appointment document is created in Firestore.
 */
exports.sendAppointmentEmail = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const newAppointment = snap.data();
    const appointmentId = context.params.appointmentId;

    if (
      !newAppointment.name ||
      !newAppointment.email ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.address ||
      !newAppointment.selectedServices
    ) {
      console.error('Missing required appointment data for email:', newAppointment);
      return null;
    }

    // Assuming 'selectedServices' contains an array of strings (e.g., service titles)
    const servicesListHtml = newAppointment.selectedServices.map(service => `<li>${service}</li>`).join('');

    const emailBodyContent = `
      <p>Hello, a new appointment has been scheduled:</p>
      <hr class="hr">
      <p><strong>Appointment ID:</strong> ${appointmentId}</p>
      <p><strong>Date:</strong> ${newAppointment.date}</p>
      <p><strong>Time:</strong> ${newAppointment.time}</p>
      <p><strong>Customer Name:</strong> ${newAppointment.name}</p>
      <p><strong>Phone:</strong> ${newAppointment.phone || 'N/A'}</p>
      <p><strong>Email:</strong> ${newAppointment.email || 'N/A'}</p>
      <p><strong>Address:</strong> ${newAppointment.address || 'N/A'}</p>
      <p><strong>Services Selected:</strong></p>
      <ul>
        ${servicesListHtml}
      </ul>
      <p><strong>Contact early if available:</strong> ${newAppointment.earlyContact ? 'Yes' : 'No'}</p>
      <hr class="hr">
      <p>Please log in to your Firebase Console (Firestore Database > 'appointments' collection) for full details and to manage this appointment.</p>
    `;

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`,
      to: FRIEND_EMAIL,
      subject: `🎉 New Pool Cleaning Appointment: ${newAppointment.name} on ${newAppointment.date}`,
      html: generateEmailHtml(`New Pool Cleaning Appointment Booked!`, emailBodyContent),
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New appointment email sent successfully to', FRIEND_EMAIL);
    } catch (_error) {
      console.error('Error sending appointment email:', _error);
    }
    return null;
  });

/**
 * Cloud Function to send an email when a new quote request document is created in Firestore.
 */
exports.sendQuoteRequestEmail = functions.firestore
  .document('quoteRequests/{quoteId}')
  .onCreate(async (snap, context) => {
    const newQuote = snap.data();
    const quoteId = context.params.quoteId;

    if (!newQuote.name || !newQuote.email || !newQuote.phone || !newQuote.message) {
      console.error('Missing required quote request data for email:', newQuote);
      return null;
    }

    const emailBodyContent = `
      <p>A new quote request has been submitted:</p>
      <hr class="hr">
      <p><strong>Request ID:</strong> ${quoteId}</p>
      <p><strong>Customer Name:</strong> ${newQuote.name}</p>
      <p><strong>Phone:</strong> ${newQuote.phone}</p>
      <p><strong>Email:</strong> ${newQuote.email}</p>
      <p><strong>Zip Code (if provided):</strong> ${newQuote.zipCode || 'N/A'}</p>
      <p><strong>Service Type (if selected):</strong> ${newQuote.serviceType || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p class="callout-box">
        ${newQuote.message}
      </p>
      <hr class="hr">
      <p>Please log in to your Firebase Console (Firestore Database > 'quoteRequests' collection) for full details.</p>
    `;

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`,
      to: FRIEND_EMAIL,
      subject: `💰 New Quote Request: ${newQuote.name}`,
      html: generateEmailHtml(`New Quote Request Received!`, emailBodyContent),
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New quote request email sent successfully to', FRIEND_EMAIL);
    } catch (_error) {
      console.error('Error sending quote request email:', _error);
    }
    return null;
  });

/**
 * Cloud Function to send an email when a new contact submission document is created in Firestore.
 */
exports.sendContactEmail = functions.firestore
  .document('contactSubmissions/{contactId}')
  .onCreate(async (snap, context) => {
    const newContact = snap.data();
    const contactId = context.params.contactId;

    if (!newContact.name || !newContact.email || !newContact.message) {
      console.error('Missing required contact submission data for email:', newContact);
      return null;
    }

    const emailBodyContent = `
      <p>A new message has been submitted through the Contact Us form:</p>
      <hr class="hr">
      <p><strong>Submission ID:</strong> ${contactId}</p>
      <p><strong>Customer Name:</strong> ${newContact.name}</p>
      <p><strong>Phone:</strong> ${newContact.phone || 'N/A'}</p>
      <p><strong>Email:</strong> ${newContact.email}</p>
      <p><strong>Message:</strong></p>
      <p class="callout-box">
        ${newContact.message}
      </p>
      <hr class="hr">
      <p>Please log in to your Firebase Console (Firestore Database > 'contactSubmissions' collection) for full details.</p>
    `;

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`,
      to: FRIEND_EMAIL,
      subject: `📧 New Contact Us Submission: ${newContact.name}`,
      html: generateEmailHtml(`New Contact Us Message!`, emailBodyContent),
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New contact email sent successfully to', FRIEND_EMAIL);
    } catch (_error) {
      console.error('Error sending contact email:', _error);
    }
    return null;
  });