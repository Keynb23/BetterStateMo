// functions/index.js

// eslint-disable-next-line no-unused-vars
const functions = require('firebase-functions');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');


admin.initializeApp();


const FRIEND_EMAIL = 'betterstatemo@gmail.com'; // <--- REPLACE THIS WITH YOUR ACTUAL EMAIL!
const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/better-state-llc.firebasestorage.app/o/Logo1.png?alt=media&token=3b293ba-4548-4867-8900-a49267b8c349';


let emailCss = '';
try {
  const cssFilePath = path.join(__dirname, 'functions_email_styles.css');
  emailCss = fs.readFileSync(cssFilePath, 'utf8');
  console.log('Successfully loaded email CSS styles globally.');
} catch (error) {
  console.error('Error loading email CSS file during global initialization:', error);
}

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
          <img src="${LOGO_URL}" alt="Better State LLC Logo" class="logo1">
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


// Function to send an email when a new appointment document is created in Firestore.
exports.sendAppointmentEmailV2 = onDocumentCreated({
  document: 'appointments/{appointmentId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD'] // <--- NEW: Declare secrets here
}, async (event) => {
  console.log('sendAppointmentEmailV2 function triggered.');
  let mailTransport;
  try {
    mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // <--- CHANGED: Use process.env
        pass: process.env.EMAIL_PASSWORD, // <--- CHANGED: Use process.env
      },
    });
    console.log('Nodemailer transporter created successfully for sendAppointmentEmailV2.');
  } catch (configError) {
    console.error('Error creating Nodemailer transporter for sendAppointmentEmailV2:', configError);
    // These specific lines will now reflect the environment variable status
    console.error('Environment Variable EMAIL_USER (sendAppointmentEmailV2):', process.env.EMAIL_USER ? '**** (set)' : '**** (NOT set)');
    console.error('Environment Variable EMAIL_PASSWORD (sendAppointmentEmailV2):', process.env.EMAIL_PASSWORD ? '**** (set)' : '**** (NOT set)');
    return null;
  }

  const newAppointment = event.data.data();
  const appointmentId = event.params.appointmentId;

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

  const servicesListHtml = newAppointment.selectedServices
    .map((service) => `<li>${service}</li>`)
    .join('');

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
    from: `Better State LLC <${process.env.EMAIL_USER}>`, // <--- CHANGED: Use process.env
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


// Function to send an email when a new quote request document is created in Firestore.
exports.sendQuoteRequestEmailV2 = onDocumentCreated({
  document: 'quoteRequests/{quoteId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD'] // <--- NEW: Declare secrets here
}, async (event) => {
  console.log('sendQuoteRequestEmailV2 function triggered.');
  let mailTransport;
  try {
    mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // <--- CHANGED: Use process.env
        pass: process.env.EMAIL_PASSWORD, // <--- CHANGED: Use process.env
      },
    });
    console.log('Nodemailer transporter created successfully for sendQuoteRequestEmailV2.');
  } catch (configError) {
    console.error('Error creating Nodemailer transporter for sendQuoteRequestEmailV2:', configError);
    console.error('Environment Variable EMAIL_USER (sendQuoteRequestEmailV2):', process.env.EMAIL_USER ? '**** (set)' : '**** (NOT set)');
    console.error('Environment Variable EMAIL_PASSWORD (sendQuoteRequestEmailV2):', process.env.EMAIL_PASSWORD ? '**** (set)' : '**** (NOT set)');
    return null;
  }

  const newQuote = event.data.data();
  const quoteId = event.params.quoteId;

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
    from: `Better State LLC <${process.env.EMAIL_USER}>`, // <--- CHANGED: Use process.env
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


// Function to send an email when a new contact submission document is created in Firestore.
exports.sendContactEmailV2 = onDocumentCreated({
  document: 'contactSubmissions/{contactId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD'] // <--- NEW: Declare secrets here
}, async (event) => {
  console.log('sendContactEmailV2 function triggered.');
  let mailTransport;
  try {
    mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // <--- CHANGED: Use process.env
        pass: process.env.EMAIL_PASSWORD, // <--- CHANGED: Use process.env
      },
    });
    console.log('Nodemailer transporter created successfully for sendContactEmailV2.');
  } catch (configError) {
    console.error('Error creating Nodemailer transporter for sendContactEmailV2:', configError);
    console.error('Environment Variable EMAIL_USER (sendContactEmailV2):', process.env.EMAIL_USER ? '**** (set)' : '**** (NOT set)');
    console.error('Environment Variable EMAIL_PASSWORD (sendContactEmailV2):', process.env.EMAIL_PASSWORD ? '**** (set)' : '**** (NOT set)');
    return null;
  }

  const newContact = event.data.data();
  const contactId = event.params.contactId;

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
    from: `Better State LLC <${process.env.EMAIL_USER}>`, // <--- CHANGED: Use process.env
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