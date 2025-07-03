// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer'); // Import Nodemailer

admin.initializeApp(); // Initialize Firebase Admin SDK

//================================================================================= UPDATE THESE STYLES AND IMPORT THE LOGO ======================

// --- Nodemailer Transporter Setup ---
// IMPORTANT: Use environment variables for sensitive info like email and password!
// We'll set these using the Firebase CLI later.
let mailTransport = nodemailer.createTransport({
  service: 'gmail', // Or 'smtp.sendgrid.net' if using SendGrid with Nodemailer
  auth: {
    user: functions.config().email.user, // Set via `firebase functions:config:set email.user="..."`
    pass: functions.config().email.password, // Set via `firebase functions:config:set email.password="..."`
  },
});

// Your friend's receiving email address
const FRIEND_EMAIL = 'YOUR_FRIENDS_BUSINESS_EMAIL@example.com'; // <--- REPLACE THIS WITH YOUR ACTUAL EMAIL!

/**
 * Cloud Function to send an email when a new appointment document is created in Firestore.
 */
exports.sendAppointmentEmail = functions.firestore
  .document('appointments/{appointmentId}') // Listens for new documents in the 'appointments' collection
  .onCreate(async (snap, context) => {
    // Triggered when a new document is created
    const newAppointment = snap.data(); // Get the data of the new appointment
    const appointmentId = context.params.appointmentId; // Get the ID of the new document

    // Basic validation: Ensure required fields are present
    if (
      !newAppointment.name ||
      !newAppointment.email ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.address ||
      !newAppointment.selectedServices
    ) {
      console.error('Missing required appointment data for email:', newAppointment); // Keeping this console.error for debugging purposes
      return null; // Exit the function if data is incomplete
    }

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`, // Sender email
      to: FRIEND_EMAIL, // Recipient email
      subject: `🎉 New Pool Cleaning Appointment: ${newAppointment.name} on ${newAppointment.date}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">New Pool Cleaning Appointment Booked!</h2>
          <p>Hello, a new appointment has been scheduled:</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
          <p><strong>Date:</strong> ${newAppointment.date}</p>
          <p><strong>Time:</strong> ${newAppointment.time}</p>
          <p><strong>Customer Name:</strong> ${newAppointment.name}</p>
          <p><strong>Phone:</strong> ${newAppointment.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${newAppointment.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${newAppointment.address || 'N/A'}</p>
          <p><strong>Services Selected:</strong> ${newAppointment.selectedServices.map((id) => `Service ${id}`).join(', ')}</p>
          <p><strong>Contact early if available:</strong> ${newAppointment.earlyContact ? 'Yes' : 'No'}</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p>Please log in to your Firebase Console (Firestore Database > 'appointments' collection) for full details and to manage this appointment.</p>
          <p>Best regards,<br>The Better State LLC Team</p>
        </div>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      // Removed the commented-out console.log to clean up the file and avoid potential future warnings
    } catch (_error) { // <-- FIX: Renamed 'error' to '_error'
      console.error('Error sending appointment email:', _error); // <-- FIX: Using the _error variable
      // Optionally throw the error to indicate failure to Firebase
      // throw new functions.https.HttpsError('internal', 'Failed to send email', _error.message); // <-- Added _error.message here if you uncomment
    }

    return null; // Always return null or a Promise in Cloud Functions
  });

/**
 * Cloud Function to send an email when a new quote request document is created in Firestore.
 */
exports.sendQuoteRequestEmail = functions.firestore
  .document('quoteRequests/{quoteId}') // Listens for new documents in the 'quoteRequests' collection
  .onCreate(async (snap, context) => {
    // Triggered when a new document is created
    const newQuote = snap.data(); // Get the data of the new quote request
    const quoteId = context.params.quoteId; // Get the ID of the new document

    // Basic validation: Ensure required fields are present
    if (!newQuote.name || !newQuote.email || !newQuote.phone || !newQuote.message) {
      console.error('Missing required quote request data for email:', newQuote); // Keeping this console.error
      return null; // Exit the function if data is incomplete
    }

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`,
      to: FRIEND_EMAIL,
      subject: `💰 New Quote Request: ${newQuote.name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">New Quote Request Received!</h2>
          <p>A new quote request has been submitted:</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>Request ID:</strong> ${quoteId}</p>
          <p><strong>Customer Name:</strong> ${newQuote.name}</p>
          <p><strong>Phone:</strong> ${newQuote.phone}</p>
          <p><strong>Email:</strong> ${newQuote.email}</p>
          <p><strong>Service ID (if selected):</strong> ${newQuote.serviceId || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; border-left: 3px solid #007bff; background-color: #f9f9f9; border-radius: 5px;">
            ${newQuote.message}
          </p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p>Please log in to your Firebase Console (Firestore Database > 'quoteRequests' collection) for full details.</p>
          <p>Best regards,<br>The Better State LLC Team</p>
        </div>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New quote request email sent successfully to', FRIEND_EMAIL); // Keeping this console.log for success tracking
    } catch (_error) { // <-- FIX: Renamed 'error' to '_error'
      console.error('Error sending quote request email:', _error); // <-- FIX: Using the _error variable
    }
    return null;
  });

/**
 * Cloud Function to send an email when a new contact submission document is created in Firestore.
 */
exports.sendContactEmail = functions.firestore
  .document('contactSubmissions/{contactId}') // Listens for new documents in the 'contactSubmissions' collection
  .onCreate(async (snap, context) => {
    // Triggered when a new document is created
    const newContact = snap.data(); // Get the data of the new contact submission
    const contactId = context.params.contactId; // Get the ID of the new document

    // Basic validation: Ensure required fields are present
    if (!newContact.name || !newContact.email || !newContact.message) {
      console.error('Missing required contact submission data for email:', newContact); // Keeping this console.error
      return null; // Exit the function if data is incomplete
    }

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`,
      to: FRIEND_EMAIL,
      subject: `📧 New Contact Us Submission: ${newContact.name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">New Contact Us Message!</h2>
          <p>A new message has been submitted through the Contact Us form:</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>Submission ID:</strong> ${contactId}</p>
          <p><strong>Customer Name:</strong> ${newContact.name}</p>
          <p><strong>Phone:</strong> ${newContact.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${newContact.email}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; border-left: 3px solid #007bff; background-color: #f9f9f9; border-radius: 5px;">
            ${newContact.message}
          </p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p>Please log in to your Firebase Console (Firestore Database > 'contactSubmissions' collection) for full details.</p>
          <p>Best regards,<br>The Better State LLC Team</p>
        </div>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      // Removed the commented-out console.log to clean up
    } catch (_error) { // <-- FIX: Renamed 'error' to '_error'
      console.error('Error sending contact email:', _error); // <-- FIX: Using the _error variable
    }
    return null;
  });