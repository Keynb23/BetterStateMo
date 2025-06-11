// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer"); // Import Nodemailer

admin.initializeApp(); // Initialize Firebase Admin SDK

// --- Nodemailer Transporter Setup ---
// IMPORTANT: Use environment variables for sensitive info like email and password!
// We'll set these using the Firebase CLI later.
let mailTransport = nodemailer.createTransport({
  service: "gmail", // Or 'smtp.sendgrid.net' if using SendGrid with Nodemailer
  auth: {
    user: functions.config().email.user, // Set via `firebase functions:config:set email.user="..."`
    pass: functions.config().email.password, // Set via `firebase functions:config:set email.password="..."`
  },
});

// Your friend's receiving email address
const FRIEND_EMAIL = "YOUR_FRIENDS_BUSINESS_EMAIL@example.com"; // <--- REPLACE THIS!

/**
 * Cloud Function to send an email when a new appointment document is created in Firestore.
 */
exports.sendAppointmentEmail = functions.firestore
  .document("appointments/{appointmentId}") // Listens for new documents in the 'appointments' collection
  .onCreate(async (snap, context) => { // Triggered when a new document is created
    const newAppointment = snap.data(); // Get the data of the new appointment
    const appointmentId = context.params.appointmentId; // Get the ID of the new document

    // Basic validation: Ensure required fields are present
    if (!newAppointment.name || !newAppointment.email || !newAppointment.date || !newAppointment.time || !newAppointment.address || !newAppointment.selectedServices) {
      console.error("Missing required appointment data for email:", newAppointment);
      return null; // Exit the function if data is incomplete
    }

    const mailOptions = {
      from: `Better State LLC <${functions.config().email.user}>`, // Sender email
      to: FRIEND_EMAIL, // Recipient email
      subject: `🎉 New Pool Cleaning Appointment: ${newAppointment.name} on ${newAppointment.date}`,
      html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0056b3;">New Pool Cleaning Appointment Booked!</h2>
                    <p>Hello ${newAppointment.name} has scheduled a pool cleaning appointment.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p><strong>Appointment ID:</strong> ${appointmentId}</p>
                    <p><strong>Date:</strong> ${newAppointment.date}</p>
                    <p><strong>Time:</strong> ${newAppointment.time}</p>
                    <p><strong>Customer Name:</strong> ${newAppointment.name}</p>
                    <p><strong>Phone:</strong> ${newAppointment.phone || "N/A"}</p>
                    <p><strong>Email:</strong> ${newAppointment.email || "N/A"}</p>
                    <p><strong>Address:</strong> ${newAppointment.address || "N/A"}</p>
                    <p><strong>Services Selected:</strong> ${newAppointment.selectedServices.map(id => `Service ${id}`).join(", ")}</p>
                    <p><strong>Contact early if available:</strong> ${newAppointment.earlyContact ? "Yes" : "No"}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p>Please log in to your Firebase Console (Firestore Database > 'appointments' collection) for full details and to manage this appointment.</p>
                    <p>Best regards,<br>The Better State LLC Team</p>
                </div>
            `
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log("New appointment email sent successfully to", FRIEND_EMAIL);
    } catch (error) {
      console.error("Error sending appointment email:", error);
      // Optionally throw the error to indicate failure to Firebase
      // throw new functions.https.HttpsError('internal', 'Failed to send email', error.message);
    }

    return null; // Always return null or a Promise in Cloud Functions
  });