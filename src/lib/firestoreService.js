// /src/lib/firestoreService.js
import { db, auth } from './../context/AuthContext.jsx'; // Import auth
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore'; // Import necessary Firestore functions

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
/* Fetches all appointments from Firestore. Defaults to ordering by createdAt descending. */
export const getAppointments = async () => {
  try {
    const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() }));
  } catch (e) {
    console.error('Error getting appointments: ', e);
    throw e;
  }
};

/* Fetches all contact submissions from Firestore. Defaults to ordering by createdAt descending.*/
export const getContactSubmissions = async () => {
  try {
    const q = query(collection(db, CONTACT_SUBMISSIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() }));
  } catch (e) {
    console.error('Error getting contact submissions: ', e);
    throw e;
  }
};

/* Fetches all quote requests from Firestore.Defaults to ordering by createdAt descending.*/
export const getQuoteRequests = async () => {
  try {
    const q = query(collection(db, QUOTE_REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() }));
  } catch (e) {
    console.error('Error getting quote requests: ', e);
    throw e;
  }
};

/*Fetches appointments for a specific user.*/
export const getCustomerAppointments = async (userId) => {
  try {
    if (!userId) {
      console.warn("getCustomerAppointments called without a userId.");
      return [];
    }
    const q = query(collection(db, APPOINTMENTS_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() }));
  } catch (e) {
    console.error('Error getting customer appointments:', e);
    throw e;
  }
};
