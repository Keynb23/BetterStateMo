import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx'; // Make sure this path is exact

// Customer Dashboard Component
const CustomerDashboard = () => {
  const { user, db, auth } = useAuth();
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState(null);

  // New state for AI service recommendations
  const [serviceDescription, setServiceDescription] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

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

  // Function to call the Gemini API for service recommendations
  const getServiceRecommendations = async () => {
    if (!serviceDescription.trim()) {
      setAiError('Please describe your needs to get recommendations.');
      return;
    }

    setLoadingAi(true);
    setAiRecommendations('');
    setAiError('');

    try {
      const prompt = `Based on the following customer description, suggest 3-5 potential pool and outdoor cleaning services. Be concise, list them as bullet points, and do not add any conversational filler.
      Customer description: "${serviceDescription}"
      Example services: Pool Cleaning, Algae Removal, Deck Cleaning, Patio Pressure Washing, Gutter Cleaning, Fence Repair, Landscaping, Leaf Removal.`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setAiRecommendations(text);
      } else {
        setAiError('Could not get recommendations. Please try again or rephrase.');
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAiError('An error occurred while fetching recommendations. Please try again.');
    } finally {
      setLoadingAi(false);
    }
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

      <div className="Profile-card">
        <h3 className="Profile-subtitle">AI Service Recommendations</h3>
        <p className="Profile-text Profile-smallText">Describe what you need help with, and our AI will suggest services.</p>
        <textarea
          className="Profile-textarea"
          rows="3"
          placeholder="e.g., 'My pool water is green and my patio needs cleaning.'"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
        ></textarea>
        <button
          onClick={getServiceRecommendations}
          className="Profile-button Profile-aiButton"
          disabled={loadingAi}
        >
          {loadingAi ? 'Getting Recommendations...' : 'Get AI Recommendations'}
        </button>
        {aiError && <p className="Profile-message Profile-errorMessage">{aiError}</p>}
        {aiRecommendations && (
          <div className="Profile-aiOutput">
            <h4 className="Profile-aiOutputTitle">Suggested Services:</h4>
            <div className="Profile-aiOutputContent" dangerouslySetInnerHTML={{ __html: aiRecommendations.replace(/\n/g, '<br>') }} />
          </div>
        )}
      </div>

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
              <li key={apt.id} className="Profile-listItem Profile-dividedListItem">
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
        <button className="Profile-button Profile-requestServiceBtn">
          Start New Request
        </button>
      </div>
    </div>
  );
};

// Owner Dashboard Component
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
              <li key={apt.id} className="Profile-listItem Profile-dividedListItem">
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
              <li key={quote.id} className="Profile-listItem Profile-dividedListItem">
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
              <li key={contact.id} className="Profile-listItem Profile-dividedListItem">
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
