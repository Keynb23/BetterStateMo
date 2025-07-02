import { db } from './../context/AuthContext.jsx';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';
const CONTACT_SUBMISSIONS_COLLECTION = 'contactSubmissions';
const QUOTE_REQUESTS_COLLECTION = 'quoteRequests';

export const addAppointment = async (appointmentData) => {
  try {
    // Add server timestamp right before sending, if not already handled
    const dataToSend = { ...appointmentData, createdAt: serverTimestamp() };
    const docRef = await addDoc(collection(db, 'appointments'), dataToSend);
    
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e; // Re-throw to propagate the error to the calling component
  }
};

export const addContactSubmission = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, CONTACT_SUBMISSIONS_COLLECTION), {
      ...contactData,
      createdAt: serverTimestamp(),
    });
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
    return docRef.id;
  } catch (e) {
    console.error('Error adding quote request: ', e);
    throw e;
  }
};