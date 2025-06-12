// src/lib/firestoreService.js

// Import db as a named export using curly braces
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';
const CONTACT_SUBMISSIONS_COLLECTION = 'contactSubmissions'; // New collection name for contact forms
const QUOTE_REQUESTS_COLLECTION = 'quoteRequests'; // New collection name for quote requests

export const addAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: serverTimestamp()
    });
    console.log("Appointment written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Adds a new contact form submission to the 'contactSubmissions' collection in Firestore.
 * @param {object} contactData - The data for the contact submission (name, email, message, etc.).
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const addContactSubmission = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, CONTACT_SUBMISSIONS_COLLECTION), {
      ...contactData,
      createdAt: serverTimestamp() // Add a timestamp for when the submission was created
    });
    console.log("Contact submission written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding contact submission: ", e);
    throw e;
  }
};

/**
 * Adds a new quote request to the 'quoteRequests' collection in Firestore.
 * @param {object} quoteData - The data for the quote request (name, phone, email, message, serviceId).
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const addQuoteRequest = async (quoteData) => {
  try {
    const docRef = await addDoc(collection(db, QUOTE_REQUESTS_COLLECTION), {
      ...quoteData,
      createdAt: serverTimestamp() // Add a timestamp for when the request was created
    });
    console.log("Quote request written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding quote request: ", e);
    throw e;
  }
};
