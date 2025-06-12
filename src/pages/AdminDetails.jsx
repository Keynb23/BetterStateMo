import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';

const AdminDetails = () => {
  const { collectionName, id } = useParams(); // Get collection name and ID from the URL
  const navigate = useNavigate();
  const { db, user, isOwner } = useAuth(); // Get user and isOwner state
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || !isOwner) { // Only owner can view these details
        setError("Unauthorized access. You must be an owner to view these details.");
        setLoading(false);
        navigate('/profile'); // Redirect non-owners
        return;
      }
      if (!db) {
        setError("Firestore database not available.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDetails({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} not found.`);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName} details:`, err);
        setError(`Failed to load ${collectionName} details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [collectionName, id, db, user, isOwner, navigate]); // Re-fetch if params or auth state changes

  const formatTimestamp = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">{error}</p>
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-message">No details to display.</p>
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="Profile-wrapper">
      <h2 className="Profile-title">{collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} Details</h2>
      <div className="Profile-card">
        {/* Render details based on collection type */}
        {collectionName === 'appointments' && (
          <>
            <p className="Profile-detailItem"><strong>Name:</strong> {details.name}</p>
            <p className="Profile-detailItem"><strong>Email:</strong> {details.email}</p>
            <p className="Profile-detailItem"><strong>Phone:</strong> {details.phone}</p>
            <p className="Profile-detailItem"><strong>Date:</strong> {details.date}</p>
            <p className="Profile-detailItem"><strong>Time:</strong> {details.time}</p>
            <p className="Profile-detailItem"><strong>Services:</strong> {details.selectedServices?.join(', ') || 'N/A'}</p>
            <p className="Profile-detailItem"><strong>Address:</strong> {details.address}</p>
            {details.notes && <p className="Profile-detailItem"><strong>Notes:</strong> {details.notes}</p>}
            <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(details.createdAt)}</p>
          </>
        )}
        {collectionName === 'quoteRequests' && (
          <>
            <p className="Profile-detailItem"><strong>Name:</strong> {details.name}</p>
            <p className="Profile-detailItem"><strong>Email:</strong> {details.email}</p>
            <p className="Profile-detailItem"><strong>Phone:</strong> {details.phone}</p>
            <p className="Profile-detailItem"><strong>Message:</strong> {details.message}</p>
            <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(details.createdAt)}</p>
          </>
        )}
        {collectionName === 'contactSubmissions' && (
          <>
            <p className="Profile-detailItem"><strong>Name:</strong> {details.name}</p>
            <p className="Profile-detailItem"><strong>Email:</strong> {details.email}</p>
            <p className="Profile-detailItem"><strong>Phone:</strong> {details.phone}</p>
            <p className="Profile-detailItem"><strong>Message:</strong> {details.message}</p>
            <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(details.createdAt)}</p>
          </>
        )}
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminDetails;
