// setClaim.js
const admin = require('firebase-admin');

// Path to your service account key file
// IMPORTANT: Make sure this path is EXACTLY correct relative to setClaim.js
const serviceAccount = require('./better-state-llc-firebase-adminsdk-fbsvc-3abbd6d603.json'); // Use YOUR downloaded filename

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// IMPORTANT: REPLACE THIS WITH THE EXACT EMAIL OF THE OWNER USER YOU CREATED IN FIREBASE AUTHENTICATION
const ownerEmail = 'keynb50@gmail.com'; // <--- **REPLACE THIS WITH THE EMAIL YOU CREATED IN FIREBASE AUTHENTICATION**
const ownerUid = ''; // Optional: if you know the UID from Firebase Auth, you can set it here.

async function setOwnerCustomClaim() {
  try {
    let userRecord;
    if (ownerUid) {
        userRecord = await admin.auth().getUser(ownerUid);
    } else {
        // This line attempts to find the user by the email you provided.
        // It will fail if no user exists with this email in Firebase Auth.
        userRecord = await admin.auth().getUserByEmail(ownerEmail);
    }

    if (userRecord.customClaims && userRecord.customClaims.role === 'owner') {
      console.log(`User ${ownerEmail} (UID: ${userRecord.uid}) already has 'owner' custom claim.`);
      return;
    }

    // Set custom user claims on this user.
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'owner' });

    // Force refresh of the ID token (important for immediate effect on client side)
    await admin.auth().revokeRefreshTokens(userRecord.uid);
    console.log(`Successfully set custom claim 'role: owner' for ${ownerEmail} (UID: ${userRecord.uid}).`);
    console.log('User ID token will be refreshed on next login or within an hour.');

  } catch (error) {
    console.error('Error setting custom claim:', error);
  }
}

setOwnerCustomClaim();
