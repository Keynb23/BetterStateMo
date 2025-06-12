import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.js';

const CustomerDashboard = () => {
  const { user, db, auth } = useAuth();
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (user && user.email) {
        setLoadingAppointments(true);
        setErrorAppointments(null);
        try {
          const q = query(collection(db, 'appointments'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCustomerAppointments(appointments);
        } catch (error) {
          console.error("Error fetching customer appointments:", error);
          setErrorAppointments("Failed to load your past appointments.");
        } finally {
          setLoadingAppointments(false);
        }
      } else {
        setLoadingAppointments(false);
      }
    };
    fetchCustomerData();
  }, [user, db]);

  return (
    <div className="profile-page">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-card">
        <h3 className="card-title">Welcome, {user?.email || 'Customer'}!</h3>
        <p className="card-text">This is your personal dashboard. Here you can:</p>
        <ul className="card-list">
          <li>View your past service requests and appointments.</li>
          <li>Request new services without re-entering your information.</li>
          <li>Update your contact details.</li>
        </ul>
        <button onClick={() => auth.signOut()} className="logout-button">
          Logout
        </button>
      </div>

      <div className="profile-card">
        <h3 className="card-title">Your Past Appointments</h3>
        {loadingAppointments ? (
          <p className="loading-text">Loading your appointments...</p>
        ) : errorAppointments ? (
          <p className="error-text">Failed to load your past appointments.</p>
        ) : customerAppointments.length === 0 ? (
          <p className="empty-text">You have no past appointments recorded.</p>
        ) : (
          <ul className="appointment-list">
            {customerAppointments.map(apt => (
              <li key={apt.id} className="appointment-item">
                <p className="appointment-title">Appointment on {apt.date} at {apt.time}</p>
                <p className="appointment-text">Services: {apt.selectedServices?.join(', ') || 'N/A'}</p>
                <p className="appointment-subtext">Address: {apt.address || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-card">
        <h3 className="card-title">Request New Service</h3>
        <p className="card-text">Your contact info (name, email, phone) will be pre-filled automatically.</p>
        <button className="request-button">
          Start New Request
        </button>
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const { db, auth } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingData(true);
      setErrorData(null);
      try {
        const aptsSnapshot = await getDocs(collection(db, 'appointments'));
        setAppointments(aptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const quotesSnapshot = await getDocs(collection(db, 'quoteRequests'));
        setQuoteRequests(quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const contactsSnapshot = await getDocs(collection(db, 'contactSubmissions'));
        setContactSubmissions(contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching owner dashboard data:", error);
        setErrorData("Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAllData();
  }, [db]);

  if (loadingData) return <div className="profile-page loading-container"><p className="loading-text">Loading owner dashboard data...</p></div>;
  if (errorData) return <div className="profile-page error-container"><p className="error-text">{errorData}</p></div>;

  return (
    <div className="profile-page">
      <h2 className="profile-title">Owner Dashboard</h2>
      <div className="profile-card">
        <h3 className="card-title">Welcome, Owner!</h3>
        <p className="card-text">This is your administrative dashboard. You can view all appointments, quote requests, and contact submissions here.</p>
        <button onClick={() => auth.signOut()} className="logout-button">
          Logout
        </button>
      </div>

      <div className="profile-card">
        <h3 className="card-title">All Appointments ({appointments.length})</h3>
        {appointments.length === 0 ? (
          <p className="empty-text">No appointments found.</p>
        ) : (
          <ul className="appointment-list">
            {appointments.map(apt => (
              <li key={apt.id} className="appointment-item">
                <p className="appointment-title">Appointment for {apt.name} on {apt.date} at {apt.time}</p>
                <p className="appointment-text">Email: {apt.email}, Phone: {apt.phone}</p>
                <p className="appointment-subtext">Address: {apt.address}</p>
                <p className="appointment-subtext">Services: {apt.selectedServices?.join(', ')}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-card">
        <h3 className="card-title">All Quote Requests ({quoteRequests.length})</h3>
        {quoteRequests.length === 0 ? (
          <p className="empty-text">No quote requests found.</p>
        ) : (
          <ul className="appointment-list">
            {quoteRequests.map(quote => (
              <li key={quote.id} className="appointment-item">
                <p className="quote-title">Quote from {quote.name}</p>
                <p className="appointment-text">Email: {quote.email}, Phone: {quote.phone}</p>
                <p className="appointment-subtext">Message: {quote.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-card">
        <h3 className="card-title">All Contact Submissions ({contactSubmissions.length})</h3>
        {contactSubmissions.length === 0 ? (
          <p className="empty-text">No contact submissions found.</p>
        ) : (
          <ul className="appointment-list">
            {contactSubmissions.map(contact => (
              <li key={contact.id} className="appointment-item">
                <p className="contact-title">Contact from {contact.name}</p>
                <p className="appointment-text">Email: {contact.email}, Phone: {contact.phone}</p>
                <p className="appointment-subtext">Message: {contact.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, loading, isOwner } = useAuth();

  if (loading) {
    return (
      <div className="profile-page loading-container">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page error-container">
        <p className="error-text">You must be logged in to view this page.</p>
      </div>
    );
  }

  return isOwner ? <OwnerDashboard /> : <CustomerDashboard />;
};

export default Profile;