import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx'; // Make sure this path is exact

const AppointmentDetails = () => {
  const { id } = useParams(); // Get the appointment ID from the URL
  const navigate = useNavigate();
  const { db, user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!user) {
        setError("You must be logged in to view appointment details.");
        setLoading(false);
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
        const docRef = doc(db, 'appointments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedAppointment = { id: docSnap.id, ...docSnap.data() };
          // Ensure the user owns this appointment for security
          if (fetchedAppointment.email === user.email) {
            setAppointment(fetchedAppointment);
          } else {
            setError("You do not have permission to view this appointment.");
            navigate('/profile'); // Redirect if not authorized
          }
        } else {
          setError("Appointment not found.");
        }
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, db, user, navigate]); // Depend on id, db, and user for refetching if they change

  if (loading) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">{error}</p>
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Profile
        </button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-message">No appointment details to display.</p>
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="Profile-wrapper">
      <h2 className="Profile-title">Appointment Details</h2>
      <div className="Profile-card">
        <p className="Profile-detailItem"><strong>Date:</strong> {appointment.date}</p>
        <p className="Profile-detailItem"><strong>Time:</strong> {appointment.time}</p>
        <p className="Profile-detailItem"><strong>Services:</strong> {appointment.selectedServices?.join(', ') || 'N/A'}</p>
        <p className="Profile-detailItem"><strong>Address:</strong> {appointment.address}</p>
        <p className="Profile-detailItem"><strong>Name:</strong> {appointment.name}</p>
        <p className="Profile-detailItem"><strong>Email:</strong> {appointment.email}</p>
        <p className="Profile-detailItem"><strong>Phone:</strong> {appointment.phone}</p>
        {appointment.notes && <p className="Profile-detailItem"><strong>Notes:</strong> {appointment.notes}</p>}
        {appointment.createdAt && (
          <p className="Profile-detailItem Profile-smallText">
            Submitted: {new Date(appointment.createdAt.toDate()).toLocaleString()}
          </p>
        )}
        <button onClick={() => navigate('/profile')} className="Profile-button Profile-requestServiceBtn mt-4">
          Go Back to Profile
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;
