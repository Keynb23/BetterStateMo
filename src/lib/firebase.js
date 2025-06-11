// src/lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <--- ADD THIS IMPORT

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf1-lLaCmCqSZuUn6v-vvrRwJ_TesX1D8",
  authDomain: "better-state-llc.firebaseapp.com",
  projectId: "better-state-llc",
  storageBucket: "better-state-llc.firebasestorage.app",
  messagingSenderId: "1000941778539",
  appId: "1:1000941778539:web:3211eee5c4977ee5e0a32e",
  measurementId: "G-RDF4SD6CR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize analytics if you plan to use it

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // Export db as a named export

// You generally don't need to export the app instance itself for basic CRUD operations
// If you need to access 'app' directly elsewhere, you can add 'export default app;'