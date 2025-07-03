import { db, auth } from './../context/AuthContext.jsx'; // Import auth
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';
const CONTACT_SUBMISSIONS_COLLECTION = 'contactSubmissions';
const QUOTE_REQUESTS_COLLECTION = 'quoteRequests';

// Helper function to get current user's UID if authenticated
const getCurrentUserId = () => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

export const addAppointment = async (appointmentData) => {
  try {
    const userId = getCurrentUserId();
    const dataToSend = {
      ...appointmentData,
      createdAt: serverTimestamp(),
      ...(userId && { userId }), // Conditionally add userId if available
    };
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), dataToSend);

    return docRef.id;
  } catch (e) {
    console.error('Error adding appointment: ', e);
    throw e; // Re-throw to propagate the error to the calling component
  }
};

export const addContactSubmission = async (contactData) => {
  try {
    const userId = getCurrentUserId();
    const docRef = await addDoc(collection(db, CONTACT_SUBMISSIONS_COLLECTION), {
      ...contactData,
      createdAt: serverTimestamp(),
      ...(userId && { userId }), // Conditionally add userId if available
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding contact submission: ', e);
    throw e;
  }
};

export const addQuoteRequest = async (quoteData) => {
  try {
    const userId = getCurrentUserId();
    const docRef = await addDoc(collection(db, QUOTE_REQUESTS_COLLECTION), {
      ...quoteData,
      createdAt: serverTimestamp(),
      ...(userId && { userId }), // Conditionally add userId if available
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding quote request: ', e);
    throw e;
  }
};
