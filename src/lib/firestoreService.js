// src/lib/firestoreService.js

// Import db directly from AuthContext.jsx
import { db } from './../context/AuthContext.jsx'; // Adjusted path to AuthContext.jsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';
const CONTACT_SUBMISSIONS_COLLECTION = 'contactSubmissions';
const QUOTE_REQUESTS_COLLECTION = 'quoteRequests';

export const addAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: serverTimestamp(),
    });
    console.log('Appointment written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const addContactSubmission = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, CONTACT_SUBMISSIONS_COLLECTION), {
      ...contactData,
      createdAt: serverTimestamp(),
    });
    console.log('Contact submission written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding contact submission: ', e);
    throw e;
  }
};

export const addQuoteRequest = async (quoteData) => {
  try {
    const docRef = await addDoc(collection(db, QUOTE_REQUESTS_COLLECTION), {
      ...quoteData,
      createdAt: serverTimestamp(),
    });
    console.log('Quote request written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding quote request: ', e);
    throw e;
  }
};
