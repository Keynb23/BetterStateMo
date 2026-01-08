// src/lib/reviewsService.js
import { db } from "../context/AuthContext.jsx";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export const getVisibleReviews = async () => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("visible", "==", true), // Equality
      orderBy("time", "desc")       // Sort (Requires Composite Index)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Ensure time is treated as a number
      time: Number(doc.data().time) 
    }));
  } catch (error) {
    console.error("Error fetching reviews for UI:", error);
    return [];
  }
};