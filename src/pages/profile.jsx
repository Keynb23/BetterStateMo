import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const ITEMS_PER_VIEW = 5;

const Profile = () => {
  const { user, db, auth, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer States
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingCustomerAppointments, setLoadingCustomerAppointments] = useState(true);
  const [errorCustomerAppointments, setErrorCustomerAppointments] = useState(null);
  const [selectedCustomerAppointment, setSelectedCustomerAppointment] = useState(null); // Selected customer apt for inline details

  // Admin States
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [errorAdminData, setErrorAdminData] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null); // Selected admin item for inline details
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null); // Collection for selected admin item

  // useEffect for pre-filling request form (customer-specific)
  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      console.log('Customer info for pre-fill:', location.state.customerInfo);
    }
  }, [location.state]);

  // useEffect for fetching customer appointments
  useEffect(() => {
    if (!authLoading && user && !isOwner && user.email && db) {
      setLoadingCustomerAppointments(true);
      setErrorCustomerAppointments(null);
      const q = query(collection(db, 'appointments'), where('email', '==', user.email));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomerAppointments(appointments);
        setLoadingCustomerAppointments(false);
      }, (error) => {
        console.error("Error fetching customer appointments:", error);
        setErrorCustomerAppointments("Failed to load your past appointments.");
        setLoadingCustomerAppointments(false);
      });
      return () => unsubscribe();
    }
  }, [user, db, isOwner, authLoading]);

  // useEffect for fetching admin data (appointments, quotes, contacts)
  useEffect(() => {
    if (!authLoading && user && isOwner && db) {
      setLoadingAdminData(true);
      setErrorAdminData(null);
      const unsubscribes = [];

      const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (querySnapshot) => {
        setAdminAppointments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Error fetching admin appointments:", error);
        setErrorAdminData("Failed to load admin appointments.");
      });
      unsubscribes.push(unsubscribeAppointments);

      const unsubscribeQuotes = onSnapshot(collection(db, 'quoteRequests'), (querySnapshot) => {
        setQuoteRequests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Error fetching quote requests:", error);
        setErrorAdminData("Failed to load quote requests.");
      });
      unsubscribes.push(unsubscribeQuotes);

      const unsubscribeContacts = onSnapshot(collection(db, 'contactSubmissions'), (querySnapshot) => {
        setContactSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Error fetching contact submissions:", error);
        setErrorAdminData("Failed to load contact submissions.");
      });
      unsubscribes.push(unsubscribeContacts);

      setLoadingAdminData(false);
      return () => unsubscribes.forEach(unsub => unsub());
    }
  }, [user, db, isOwner, authLoading]);

  // Handle new service request (customer-specific)
  const handleStartNewRequest = () => {
    navigate('/setapt', {
      state: {
        customerInfo: {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || ''
        }
      }
    });
  };

  // Handle customer appointment detail view
  const handleViewCustomerAppointmentDetails = (apt) => {
    setSelectedCustomerAppointment(apt);
  };

  // Handle admin item detail view
  const handleViewAdminItemDetails = (item, collectionName) => {
    setSelectedAdminItem(item);
    setSelectedAdminCollection(collectionName);
  };

  // Close detail view
  const handleCloseDetails = () => {
    setSelectedCustomerAppointment(null);
    setSelectedAdminItem(null);
    setSelectedAdminCollection(null);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    return 'N/A';
  };

  // Main loading and authentication checks
  if (authLoading) {
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
      </div>
    );
  }

  // Admin Section
  if (isOwner) {
    if (loadingAdminData) return <div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading admin dashboard data...</p></div>;
    if (errorAdminData) return <div className="Profile-loadingWrapper"><p className="Profile-errorMessage">{errorAdminData}</p></div>;

    return (
      <div className="Profile-wrapper">
        <div className="Profile-main-content">
          <div className="Profile-section">
            <h2 className="Profile-title">Owner Dashboard</h2>
            <div className="Profile-card">
              <h3 className="Profile-subtitle">Welcome, Owner!</h3>
              <p className="Profile-text">This is your administrative dashboard.</p>
              <button onClick={() => auth.signOut()} className="Profile-button Profile-logoutBtn">
                Logout
              </button>
            </div>
          </div>

          {/* Admin Appointments */}
          <div className="Profile-section">
            <div className="Profile-card">
              <h3 className="Profile-subtitle">All Appointments ({adminAppointments.length})</h3>
              {adminAppointments.length === 0 ? (
                <p className="Profile-message">No appointments found.</p>
              ) : (
                <ul className="Profile-list Profile-dividedList">
                  {adminAppointments.slice(0, ITEMS_PER_VIEW).map(apt => (
                    <li key={apt.id} className="Profile-listItem Profile-dividedListItem Profile-clickableItem" onClick={() => handleViewAdminItemDetails(apt, 'appointments')}>
                      <p className="Profile-appointmentTitle">Appointment for {apt.name} on {apt.date} at {apt.time}</p>
                      <p className="Profile-appointmentDetail">Email: {apt.email}, Phone: {apt.phone}</p>
                      <p className="Profile-appointmentDetail Profile-smallText">Address: {apt.address}</p>
                      <p className="Profile-appointmentDetail Profile-smallText">Services: {apt.selectedServices?.join(', ')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Admin Quote Requests */}
          <div className="Profile-section">
            <div className="Profile-card">
              <h3 className="Profile-subtitle">All Quote Requests ({quoteRequests.length})</h3>
              {quoteRequests.length === 0 ? (
                <p className="Profile-message">No quote requests found.</p>
              ) : (
                <ul className="Profile-list Profile-dividedList">
                  {quoteRequests.slice(0, ITEMS_PER_VIEW).map(quote => (
                    <li key={quote.id} className="Profile-listItem Profile-dividedListItem Profile-clickableItem" onClick={() => handleViewAdminItemDetails(quote, 'quoteRequests')}>
                      <p className="Profile-quoteTitle">Quote from {quote.name}</p>
                      <p className="Profile-quoteDetail">Email: {quote.email}, Phone: {quote.phone}</p>
                      <p className="Profile-quoteDetail Profile-smallText">Message: {quote.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Admin Contact Submissions */}
          <div className="Profile-section">
            <div className="Profile-card">
              <h3 className="Profile-subtitle">All Contact Submissions ({contactSubmissions.length})</h3>
              {contactSubmissions.length === 0 ? (
                <p className="Profile-message">No contact submissions found.</p>
              ) : (
                <ul className="Profile-list Profile-dividedList">
                  {contactSubmissions.slice(0, ITEMS_PER_VIEW).map(contact => (
                    <li key={contact.id} className="Profile-listItem Profile-dividedListItem Profile-clickableItem" onClick={() => handleViewAdminItemDetails(contact, 'contactSubmissions')}>
                      <p className="Profile-contactTitle">Contact from {contact.name}</p>
                      <p className="Profile-contactDetail">Email: {contact.email}, Phone: {contact.phone}</p>
                      <p className="Profile-contactDetail Profile-smallText">Message: {contact.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Admin Details Display */}
          {selectedAdminItem && (
            <div className="Profile-section Profile-detail-section">
              <h3 className="Profile-subtitle">Details for {selectedAdminCollection === 'appointments' ? 'Appointment' : selectedAdminCollection === 'quoteRequests' ? 'Quote Request' : 'Contact Submission'}</h3>
              <div className="Profile-card">
                {selectedAdminCollection === 'appointments' && (
                  <>
                    <p className="Profile-detailItem"><strong>Name:</strong> {selectedAdminItem.name}</p>
                    <p className="Profile-detailItem"><strong>Email:</strong> {selectedAdminItem.email}</p>
                    <p className="Profile-detailItem"><strong>Phone:</strong> {selectedAdminItem.phone}</p>
                    <p className="Profile-detailItem"><strong>Date:</strong> {selectedAdminItem.date}</p>
                    <p className="Profile-detailItem"><strong>Time:</strong> {selectedAdminItem.time}</p>
                    <p className="Profile-detailItem"><strong>Services:</strong> {selectedAdminItem.selectedServices?.join(', ') || 'N/A'}</p>
                    <p className="Profile-detailItem"><strong>Address:</strong> {selectedAdminItem.address}</p>
                    {selectedAdminItem.notes && <p className="Profile-detailItem"><strong>Notes:</strong> {selectedAdminItem.notes}</p>}
                    <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(selectedAdminItem.createdAt)}</p>
                  </>
                )}
                {selectedAdminCollection === 'quoteRequests' && (
                  <>
                    <p className="Profile-detailItem"><strong>Name:</strong> {selectedAdminItem.name}</p>
                    <p className="Profile-detailItem"><strong>Email:</strong> {selectedAdminItem.email}</p>
                    <p className="Profile-detailItem"><strong>Phone:</strong> {selectedAdminItem.phone}</p>
                    <p className="Profile-detailItem"><strong>Message:</strong> {selectedAdminItem.message}</p>
                    <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(selectedAdminItem.createdAt)}</p>
                  </>
                )}
                {selectedAdminCollection === 'contactSubmissions' && (
                  <>
                    <p className="Profile-detailItem"><strong>Name:</strong> {selectedAdminItem.name}</p>
                    <p className="Profile-detailItem"><strong>Email:</strong> {selectedAdminItem.email}</p>
                    <p className="Profile-detailItem"><strong>Phone:</strong> {selectedAdminItem.phone}</p>
                    <p className="Profile-detailItem"><strong>Message:</strong> {selectedAdminItem.message}</p>
                    <p className="Profile-detailItem Profile-smallText"><strong>Submitted:</strong> {formatTimestamp(selectedAdminItem.createdAt)}</p>
                  </>
                )}
                <button onClick={handleCloseDetails} className="Profile-button Profile-requestServiceBtn mt-4">
                  Close Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Customer Section
  if (loadingCustomerAppointments) return <div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading your appointments...</p></div>;
  if (errorCustomerAppointments) return <div className="Profile-loadingWrapper"><p className="Profile-errorMessage">{errorCustomerAppointments}</p></div>;

  return (
    <div className="Profile-wrapper">
      <div className="Profile-main-content">
        <div className="Profile-section">
          <h2 className="Profile-title">Your Profile</h2>
          <div className="Profile-card">
            <h3 className="Profile-subtitle">Welcome, {user?.email || 'Customer'}!</h3>
            <p className="Profile-text">This is your personal dashboard.</p>
            <button onClick={() => auth.signOut()} className="Profile-button Profile-logoutBtn">
              Logout
            </button>
          </div>
        </div>

        {/* Customer Past Appointments */}
        <div className="Profile-section">
          <div className="Profile-card">
            <h3 className="Profile-subtitle">Your Past Appointments</h3>
            {customerAppointments.length === 0 ? (
              <p className="Profile-message">You have no past appointments recorded.</p>
            ) : (
              <ul className="Profile-list Profile-dividedList">
                {customerAppointments.slice(0, ITEMS_PER_VIEW).map(apt => (
                  <li key={apt.id} className="Profile-listItem Profile-dividedListItem Profile-clickableItem" onClick={() => handleViewCustomerAppointmentDetails(apt)}>
                    <p className="Profile-appointmentDetail">Services: {apt.selectedServices?.join(', ') || 'N/A'}</p>
                    <p className="Profile-appointmentTitle">Appointment on {apt.date} at {apt.time}</p>
                    <p className="Profile-appointmentDetail Profile-smallText">Address: {apt.address || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Customer New Service Request */}
        <div className="Profile-section">
          <div className="Profile-card">
            <h3 className="Profile-subtitle">Request New Service</h3>
            <p className="Profile-text Profile-smallText">Your contact info will be pre-filled automatically.</p>
            <button onClick={handleStartNewRequest} className="Profile-button Profile-requestServiceBtn">
              Start New Request
            </button>
          </div>
        </div>

        {/* Customer Appointment Details Display */}
        {selectedCustomerAppointment && (
          <div className="Profile-section Profile-detail-section">
            <h3 className="Profile-subtitle">Appointment Details</h3>
            <div className="Profile-card">
              <p className="Profile-detailItem"><strong>Date:</strong> {selectedCustomerAppointment.date}</p>
              <p className="Profile-detailItem"><strong>Time:</strong> {selectedCustomerAppointment.time}</p>
              <p className="Profile-detailItem"><strong>Services:</strong> {selectedCustomerAppointment.selectedServices?.join(', ') || 'N/A'}</p>
              <p className="Profile-detailItem"><strong>Address:</strong> {selectedCustomerAppointment.address}</p>
              <p className="Profile-detailItem"><strong>Name:</strong> {selectedCustomerAppointment.name}</p>
              <p className="Profile-detailItem"><strong>Email:</strong> {selectedCustomerAppointment.email}</p>
              <p className="Profile-detailItem"><strong>Phone:</strong> {selectedCustomerAppointment.phone}</p>
              {selectedCustomerAppointment.notes && <p className="Profile-detailItem"><strong>Notes:</strong> {selectedCustomerAppointment.notes}</p>}
              {selectedCustomerAppointment.createdAt && (
                <p className="Profile-detailItem Profile-smallText">
                  Submitted: {formatTimestamp(selectedCustomerAppointment.createdAt)}
                </p>
              )}
              <button onClick={handleCloseDetails} className="Profile-button Profile-requestServiceBtn mt-4">
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
