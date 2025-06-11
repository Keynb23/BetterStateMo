
done:

set up firebase stuff
added backend cart feature (a middle man)
tested all buttons besides contact buttons





TO DO: 

create Blaze account with card info (business card) 

add sms notifications refer to instruction at bottom of this page



add tests with jest

Chat bot that can set apts, leave a message to be contacted, Requrest quote(request to be contacted, but it send a message to business saying they would like a quote on this service) 

Testimonial page


create a profile page

create a login/register component with a log out button.

once you set an apt, a profile will automatically be generated for you, then you will be prompted to set a password. you can decline this option and your profile will be deleted or not created at all.
// simple profile page. just a page for customer to check for updates on the job they order
// easily put in a service request without having to go through the whole process. 


ideas:

Maybe a donate page for a the VA hospital or something. Further lean into the Vet owned thing. Plus I think there are tax write offs.



==========================================================================================================================

Okay, no problem at all! Let's get you a clear checklist for when you're ready to tackle the SMS setup.

Here's what you'll need to do later for the SMS notifications:
No problem! It's smart to plan ahead. Here's your checklist for setting up SMS notifications:

SMS Notification Setup Checklist:
Phase 1: Prerequisites & Account Setup (Crucial before deployment)

Upgrade Firebase Project to Blaze Plan:

This is non-negotiable for deploying Cloud Functions. As discussed, it enables billing but your usage will likely stay within the generous free tiers.
Get your friend's credit card information and follow the link provided in the error message, or go to the Firebase Console -> "Usage and Billing" -> "Upgrade project."
Create a Twilio Account (Recommended):

Go to Twilio.com and sign up for a free trial account.
Find your Account SID and Auth Token: These are your unique Twilio credentials, usually found on your Twilio console dashboard.
Get a Twilio Phone Number: Purchase a Twilio phone number (a small monthly fee, e.g., $1.15/month for a US number) that can send SMS messages. During the free trial, you might be able to test with a trial number, but a paid number is needed for production.
Phase 2: Code & Configuration (In your functions directory)

Install the Twilio Library:

Open your terminal.
Navigate into your functions directory:
Bash

cd C:\Users\keynb\OneDrive\Desktop\Coding\Projects\Business\BetterStateMo\BetterStateMo-5\functions
Install the Twilio Node.js library:
Bash

npm install twilio
Update functions/index.js with SMS Logic:

Open functions/index.js.
Require Twilio: Add const twilio = require('twilio'); at the top of your file.
Create Twilio Client:
JavaScript

// Add these lines near the top, after admin.initializeApp();
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = functions.config().twilio.phone_number; // The Twilio number you bought
Add an SMS Function: Decide when you want to send the SMS (e.g., when a new appointment is created, or when its status changes). You'll likely create another Cloud Function, similar to your email one.
Example (sending SMS on new appointment):
JavaScript

exports.sendSmsOnNewAppointment = functions.firestore
    .document('appointments/{appointmentId}')
    .onCreate(async (snap, context) => {
        const appointmentData = snap.data();
        const customerPhoneNumber = appointmentData.phoneNumber; // Assuming you store phone numbers in this field
        const customerName = appointmentData.name;
        const appointmentDate = appointmentData.date; // Or whatever relevant data you have

        const messageBody = `Hello ${customerName}! Your pool cleaning appointment is confirmed for ${appointmentDate}. We look forward to seeing you!`;

        try {
            await twilioClient.messages.create({
                body: messageBody,
                to: customerPhoneNumber,
                from: twilioPhoneNumber // Your Twilio number
            });
            console.log('SMS sent successfully!');
            return null; // Important for Cloud Functions
        } catch (error) {
            console.error('Error sending SMS:', error);
            return null; // Important for Cloud Functions
        }
    });
Remember to use E.164 format for phone numbers (e.g., +15551234567).
Set Environment Variables for Twilio:

This is how your Cloud Function securely accesses your Twilio credentials without hardcoding them.
Open your terminal in your project's root directory (where firebase.json is).
Run these commands (replace placeholders with your actual Twilio details):
Bash

firebase functions:config:set twilio.sid="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" twilio.token="your_auth_token" twilio.phone_number="+1234567890"
After running this, you'll need to redeploy your functions for the new configuration to take effect.
Phase 3: Deployment & Testing

Deploy Your Functions:

Open your terminal in your project's root directory.
Deploy the updated functions:
Bash

firebase deploy --only functions
Test the SMS Functionality:

Trigger the Cloud Function (e.g., create a new appointment document in Firestore as per your onCreate trigger).
Check your phone for the SMS message.
Check the Cloud Function logs in the Firebase Console (Functions -> Logs) for any errors.