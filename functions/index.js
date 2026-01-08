const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Initialize Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Import the Scheduled Sync Function
const { syncGoogleReviews } = require('./scheduledSyncReviews');

const FRIEND_EMAIL = 'betterstatemo@gmail.com'; 
const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/better-state-llc.firebasestorage.app/o/Logo1.png?alt=media&token=3b293ba-4548-4867-8900-a49267b8c349';

// Global CSS Loader
let emailCss = '';
try {
  const cssFilePath = path.join(__dirname, 'functions_email_styles.css');
  emailCss = fs.readFileSync(cssFilePath, 'utf8');
  console.log('Successfully loaded email CSS styles globally.');
} catch (error) {
  console.error('Error loading email CSS file:', error);
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
      <style>${emailCss}</style>
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

// --- CLOUD FUNCTIONS EXPORTS ---

// 1. Google Review Sync
exports.syncGoogleReviews = syncGoogleReviews;

// 2. Appointment Email Function
exports.sendAppointmentEmailV2 = onDocumentCreated({
  document: 'appointments/{appointmentId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD']
}, async (event) => {
  console.log('sendAppointmentEmailV2 triggered.');
  
  let mailTransport;
  try {
    mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  } catch (err) {
    console.error('Transport error:', err);
    return null;
  }

  const newAppointment = event.data.data();
  const appointmentId = event.params.appointmentId;

  if (!newAppointment.name || !newAppointment.email || !newAppointment.address || !newAppointment.selectedServices) {
    console.error('Missing REQUIRED appointment data.');
    return null;
  }

  const servicesListHtml = newAppointment.selectedServices.map((service) => `<li>${service}</li>`).join('');
  const appointmentDate = newAppointment.date ? `<p><strong>Date:</strong> ${newAppointment.date}</p>` : '';
  const appointmentTime = newAppointment.time ? `<p><strong>Time:</strong> ${newAppointment.time}</p>` : '';

  const emailBodyContent = `
      <p>Hello, a new appointment has been scheduled:</p>
      <hr class="hr">
      <p><strong>Appointment ID:</strong> ${appointmentId}</p>
      ${appointmentDate}
      ${appointmentTime}
      <p><strong>Customer Name:</strong> ${newAppointment.name}</p>
      <p><strong>Phone:</strong> ${newAppointment.phone || 'N/A'}</p>
      <p><strong>Email:</strong> ${newAppointment.email || 'N/A'}</p>
      <p><strong>Address:</strong> ${newAppointment.address || 'N/A'}</p>
      <p><strong>Services Selected:</strong></p>
      <ul>${servicesListHtml}</ul>
      <p><strong>Contact early if available:</strong> ${newAppointment.earlyContact ? 'Yes' : 'No'}</p>
      <hr class="hr">
      <p>Please log in to your Firebase Console for full details.</p>
    `;

  const mailOptions = {
    from: `Better State LLC <${process.env.EMAIL_USER}>`,
    to: FRIEND_EMAIL,
    subject: `🎉 New Pool Cleaning Appointment: ${newAppointment.name}`,
    html: generateEmailHtml(`New Pool Cleaning Appointment Booked!`, emailBodyContent),
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log('Appointment email sent successfully.');
  } catch (e) {
    console.error('Error sending email:', e);
  }
  return null;
});

// 3. Quote Request Email Function
exports.sendQuoteRequestEmailV2 = onDocumentCreated({
  document: 'quoteRequests/{quoteId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD']
}, async (event) => {
  let mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

  const newQuote = event.data.data();
  const emailBodyContent = `
      <p>A new quote request has been submitted:</p>
      <hr class="hr">
      <p><strong>Customer Name:</strong> ${newQuote.name}</p>
      <p><strong>Phone:</strong> ${newQuote.phone}</p>
      <p><strong>Email:</strong> ${newQuote.email}</p>
      <p><strong>Message:</strong></p>
      <p class="callout-box">${newQuote.message}</p>
    `;

  const mailOptions = {
    from: `Better State LLC <${process.env.EMAIL_USER}>`,
    to: FRIEND_EMAIL,
    subject: `💰 New Quote Request: ${newQuote.name}`,
    html: generateEmailHtml(`New Quote Request Received!`, emailBodyContent),
  };

  await mailTransport.sendMail(mailOptions);
  return null;
});

// 4. Contact Submission Email Function
exports.sendContactEmailV2 = onDocumentCreated({
  document: 'contactSubmissions/{contactId}',
  secrets: ['EMAIL_USER', 'EMAIL_PASSWORD']
}, async (event) => {
  let mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

  const newContact = event.data.data();
  const emailBodyContent = `
      <p>A new message from Contact Us form:</p>
      <hr class="hr">
      <p><strong>Customer Name:</strong> ${newContact.name}</p>
      <p><strong>Email:</strong> ${newContact.email}</p>
      <p><strong>Message:</strong></p>
      <p class="callout-box">${newContact.message}</p>
    `;

  const mailOptions = {
    from: `Better State LLC <${process.env.EMAIL_USER}>`,
    to: FRIEND_EMAIL,
    subject: `📧 New Contact Us Submission: ${newContact.name}`,
    html: generateEmailHtml(`New Contact Us Message!`, emailBodyContent),
  };

  await mailTransport.sendMail(mailOptions);
  return null;
});