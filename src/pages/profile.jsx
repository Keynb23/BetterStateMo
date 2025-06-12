import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx'; // Make sure this path is exact
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Customer Dashboard Component
const CustomerDashboard = () => {
  const { user, db, auth } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (user && user.email) {
        setLoadingAppointments(true);
        setErrorAppointments(null);
        try {
          // Use onSnapshot for real-time updates
          const q = query(collection(db, 'appointments'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q); // Use getDocs for initial fetch
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

  const handleViewAppointmentDetails = (id) => {
    navigate(`/appointment-details/${id}`);
  };

  const handleStartNewRequest = () => {
    navigate('/setapt'); // Navigate to the Set Appointment page
  };

  return (
    <div className="Profile-wrapper">
      <h2 className="Profile-title">Your Profile</h2>
      <div className="Profile-card">
        <h3 className="Profile-subtitle">Welcome, {user?.email || 'Customer'}!</h3>
        <p className="Profile-text">This is your personal dashboard. Here you can:</p>
        <ul className="Profile-list">
          <li className="Profile-listItem">View your past service requests and appointments.</li>
          <li className="Profile-listItem">Request new services without re-entering your information.</li>
          <li className="Profile-listItem">Update your contact details.</li>
        </ul>
        <button onClick={() => auth.signOut()} className="Profile-button Profile-logoutBtn">
          Logout
        </button>
      </div>

      {/* Removed AI Service Recommendations Section */}

      <div className="Profile-card">
        <h3 className="Profile-subtitle">Your Past Appointments</h3>
        {loadingAppointments ? (
          <p className="Profile-message Profile-loadingMessage">Loading your appointments...</p>
        ) : errorAppointments ? (
          <p className="Profile-message Profile-errorMessage">{errorAppointments}</p>
        ) : customerAppointments.length === 0 ? (
          <p className="Profile-message">You have no past appointments recorded.</p>
        ) : (
          <ul className="Profile-list Profile-dividedList">
            {customerAppointments.map(apt => (
              <li
                key={apt.id}
                className="Profile-listItem Profile-dividedListItem Profile-clickableItem"
                onClick={() => handleViewAppointmentDetails(apt.id)} // Make clickable
              >
                <p className="Profile-appointmentTitle">Appointment on {apt.date} at {apt.time}</p>
                <p className="Profile-appointmentDetail">Services: {apt.selectedServices?.join(', ') || 'N/A'}</p>
                <p className="Profile-appointmentDetail Profile-smallText">Address: {apt.address || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="Profile-card">
        <h3 className="Profile-subtitle">Request New Service</h3>
        <p className="Profile-text Profile-smallText">Your contact info (name, email, phone) will be pre-filled automatically.</p>
        <button onClick={handleStartNewRequest} className="Profile-button Profile-requestServiceBtn">
          Start New Request
        </button>
      </div>
    </div>
  );
};

// Owner Dashboard Component
const OwnerDashboard = () => {
  const { db, auth } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
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

  const handleViewAdminDetails = (collectionName, id) => {
    navigate(`/admin-details/${collectionName}/${id}`);
  };

  if (loadingData) return <div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading owner dashboard data...</p></div>;
  if (errorData) return <div className="Profile-loadingWrapper"><p className="Profile-errorMessage">{errorData}</p></div>;

  return (
    <div className="Profile-wrapper">
      <h2 className="Profile-title">Owner Dashboard</h2>
      <div className="Profile-card">
        <h3 className="Profile-subtitle">Welcome, Owner!</h3>
        <p className="Profile-text">This is your administrative dashboard. You can view all appointments, quote requests, and contact submissions here.</p>
        <button onClick={() => auth.signOut()} className="Profile-button Profile-logoutBtn">
          Logout
        </button>
      </div>

      {/* Appointments Section */}
      <div className="Profile-card">
        <h3 className="Profile-subtitle">All Appointments ({appointments.length})</h3>
        {appointments.length === 0 ? (
          <p className="Profile-message">No appointments found.</p>
        ) : (
          <ul className="Profile-list Profile-dividedList">
            {appointments.map(apt => (
              <li
                key={apt.id}
                className="Profile-listItem Profile-dividedListItem Profile-clickableItem"
                onClick={() => handleViewAdminDetails('appointments', apt.id)} // Make clickable
              >
                <p className="Profile-appointmentTitle">Appointment for {apt.name} on {apt.date} at {apt.time}</p>
                <p className="Profile-appointmentDetail">Email: {apt.email}, Phone: {apt.phone}</p>
                <p className="Profile-appointmentDetail Profile-smallText">Address: {apt.address}</p>
                <p className="Profile-appointmentDetail Profile-smallText">Services: {apt.selectedServices?.join(', ')}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quote Requests Section */}
      <div className="Profile-card">
        <h3 className="Profile-subtitle">All Quote Requests ({quoteRequests.length})</h3>
        {quoteRequests.length === 0 ? (
          <p className="Profile-message">No quote requests found.</p>
        ) : (
          <ul className="Profile-list Profile-dividedList">
            {quoteRequests.map(quote => (
              <li
                key={quote.id}
                className="Profile-listItem Profile-dividedListItem Profile-clickableItem"
                onClick={() => handleViewAdminDetails('quoteRequests', quote.id)} // Make clickable
              >
                <p className="Profile-quoteTitle">Quote from {quote.name}</p>
                <p className="Profile-quoteDetail">Email: {quote.email}, Phone: {quote.phone}</p>
                <p className="Profile-quoteDetail Profile-smallText">Message: {quote.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Contact Submissions Section */}
      <div className="Profile-card">
        <h3 className="Profile-subtitle">All Contact Submissions ({contactSubmissions.length})</h3>
        {contactSubmissions.length === 0 ? (
          <p className="Profile-message">No contact submissions found.</p>
        ) : (
          <ul className="Profile-list Profile-dividedList">
            {contactSubmissions.map(contact => (
              <li
                key={contact.id}
                className="Profile-listItem Profile-dividedListItem Profile-clickableItem"
                onClick={() => handleViewAdminDetails('contactSubmissions', contact.id)} // Make clickable
              >
                <p className="Profile-contactTitle">Contact from {contact.name}</p>
                <p className="Profile-contactDetail">Email: {contact.email}, Phone: {contact.phone}</p>
                <p className="Profile-contactDetail Profile-smallText">Message: {contact.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const { user, loading, isOwner } = useAuth();

  if (loading) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">You must be logged in to view this page.</p>
      </div >
    );
  }

  return isOwner ? <OwnerDashboard /> : <CustomerDashboard />;
};

export default Profile;
