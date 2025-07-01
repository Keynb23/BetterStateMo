// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration - HARDCODED FOR LOCAL DEVELOPMENT
// REMEMBER TO REVERT THIS IF DEPLOYING TO CANVAS/OTHER ENVIRONMENTS
const firebaseConfig = {
  apiKey: 'AIzaSyBf1-lLaCmCqSZuUn6v-vvrRwJ_TesX1D8', // <--- THIS IS THE CORRECTED API KEY
  authDomain: 'better-state-llc.firebaseapp.com',
  projectId: 'better-state-llc',
  storageBucket: 'better-state-llc.firebasestorage.app',
  messagingSenderId: '1000941778539',
  appId: '1:1000941778539:web:3211eee5c4977ee5e0a32e',
  measurementId: 'G-RDF4SD6CR1',
};

// Initialize Firebase only if no app has been initialized yet.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Owner's email for demonstration purposes
const OWNER_EMAILS = ['keynb50@gmail.com']; // Ensure this matches your owner's authenticated email

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsOwner(OWNER_EMAILS.includes(currentUser.email));
      } else {
        setUser(null);
        setIsOwner(false);
      }
      setLoading(false);
    });
    const initAuth = async () => {
      try {
        // If Vercel is trying to inject __initial_auth_token and it's invalid,
        // or Firebase is erroring on it, this is the cause.
        // if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        //   await signInWithCustomToken(auth, __initial_auth_token);
        // }
      } catch (error) {
        console.error('Firebase auth initialization error:', error);
        // It's good to ensure setLoading(false) even on error so app doesn't stay in loading state
        setLoading(false);
      }
    };

    if (loading) {
      initAuth();
    }

    return () => unsubscribe();
  }, [loading]);

  const value = { user, loading, isOwner, auth, db, signOut };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export { auth, db };