import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Define Firebase config from global variables
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Owner's email for demonstration purposes (replace with actual owner emails)
const OWNER_EMAILS = ["owner@example.com", "BetterSTateEmail@example.com"]; // REPLACE WITH ACTUAL OWNER EMAILS

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
        // Check if the current user's email is in the list of owner emails
        setIsOwner(OWNER_EMAILS.includes(currentUser.email));
      } else {
        setUser(null);
        setIsOwner(false);
      }
      setLoading(false);
    });

    // Attempt to sign in with custom token if available
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          // Fallback to anonymous sign-in for general users if no custom token
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase auth initialization error:", error);
      }
    };

    if (loading) { 
      initAuth();
    }

    return () => unsubscribe(); // Cleanup subscription
  }, [loading]); // Depend on loading to ensure initAuth runs once

  const value = { user, loading, isOwner, auth, db, signOut }; 

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
