// src/lib/firestoreService.js

// Import db as a named export using curly braces
import { db } from './firebase'; // This is correct now!
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';

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