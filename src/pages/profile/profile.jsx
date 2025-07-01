import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate} from 'react-router-dom';
import './ProfileStyles.css';

// Import the new components
import ProfileHeader from './ProfileHeader.jsx';
import ProfileAppointments from './ProfileAppointments.jsx';
import ProfileQuoteRequests from './ProfileQuoteRequests.jsx';
import ProfileContactSubmissions from './ProfileContactSubmissions.jsx';
import ProfileSettings from './ProfileSettings.jsx'; // This is now a self-contained component
import ProfileDetailsPanel from './ProfileDetailsPanel.jsx';

const ITEMS_PER_PAGE = 5;

const Profile = () => {
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingCustomerAppointments, setLoadingCustomerAppointments] = useState(true);
  const [errorCustomerAppointments, setErrorCustomerAppointments] = useState(null);

  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [errorAdminData, setErrorAdminData] = useState(null);

  // Detail panel states
  const [selectedCustomerAppointment, setSelectedCustomerAppointment] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null);

  // Effect to set initial tab based on customer/admin status
  useEffect(() => {
    if (!authLoading) {
      if (isOwner) {
        setActiveTab('appointments');
      } else {
        setActiveTab('appointments');
      }
    }
  }, [authLoading, isOwner]);


  // Effect for customer appointments
  useEffect(() => {
    if (!authLoading && user && !isOwner && user.email && db) {
      setLoadingCustomerAppointments(true);
      setErrorCustomerAppointments(null);
      const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const appointments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCustomerAppointments(appointments);
          setLoadingCustomerAppointments(false);
        },
        (error) => {
          console.error('Error fetching customer appointments:', error);
          setErrorCustomerAppointments('Failed to load your past appointments.');
          setLoadingCustomerAppointments(false);
        },
      );
      return () => unsubscribe();
    }
  }, [user, db, isOwner, authLoading]);

  // Effect for admin data (appointments, quotes, contacts)
  useEffect(() => {
    if (!authLoading && user && isOwner && db) {
      setLoadingAdminData(true);
      setErrorAdminData(null);
      const unsubscribes = [];

      const unsubscribeAppointments = onSnapshot(
        collection(db, 'appointments'),
        (querySnapshot) =>
          setAdminAppointments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
        (error) => {
          console.error('Error fetching admin appointments:', error);
          setErrorAdminData('Failed to load admin appointments.');
        },
      );
      unsubscribes.push(unsubscribeAppointments);

      const unsubscribeQuotes = onSnapshot(
        collection(db, 'quoteRequests'),
        (querySnapshot) =>
          setQuoteRequests(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
        (error) => {
          console.error('Error fetching quote requests:', error);
          setErrorAdminData('Failed to load quote requests.');
        },
      );
      unsubscribes.push(unsubscribeQuotes);

      const unsubscribeContacts = onSnapshot(
        collection(db, 'contactSubmissions'),
        (querySnapshot) => {
          const contactSubmissions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          contactSubmissions.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
          setContactSubmissions(contactSubmissions);
        },
        (error) => {
          console.error('Error fetching contact submissions:', error);
          setErrorAdminData('Failed to load contact submissions.');
        },
      );
      unsubscribes.push(unsubscribeContacts);

      setLoadingAdminData(false); // Set to false after all subscriptions are set up
      return () => unsubscribes.forEach((unsub) => unsub());
    }
  }, [user, db, isOwner, authLoading]);

  const handleStartNewRequest = () => {
    navigate('/setapt', {
      state: {
        customerInfo: {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '', // user.phoneNumber might not be directly from Firebase Auth if not set there.
        },
      },
    });
  };

  const handleViewCustomerAppointmentDetails = (apt) => {
    setSelectedCustomerAppointment(apt);
    setSelectedAdminItem(null); // Clear admin selection
  };

  const handleViewAdminItemDetails = (item, collectionName) => {
    setSelectedAdminItem(item);
    setSelectedAdminCollection(collectionName);
    setSelectedCustomerAppointment(null); // Clear customer selection
  };

  const handleCloseDetails = () => {
    setSelectedCustomerAppointment(null);
    setSelectedAdminItem(null);
    setSelectedAdminCollection(null);
  };

  const filterItems = (items) => {
    if (!searchTerm) return items;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return items.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const emailMatch = item.email?.toLowerCase().includes(lowerCaseSearchTerm);
      const phoneMatch = item.phone?.toLowerCase().includes(lowerCaseSearchTerm);
      const addressMatch = item.address?.toLowerCase().includes(lowerCaseSearchTerm);
      const dateMatch =
        typeof item.date === 'string' && item.date.toLowerCase().includes(lowerCaseSearchTerm);
      const timeMatch =
        typeof item.time === 'string' && item.time.toLowerCase().includes(lowerCaseSearchTerm);
      const messageMatch =
        typeof item.message === 'string' &&
        item.message.toLowerCase().includes(lowerCaseSearchTerm);
      const servicesMatch = item.selectedServices?.some(
        (service) => typeof service === 'string' && service.toLowerCase().includes(lowerCaseSearchTerm),
      );
      return (
        nameMatch ||
        emailMatch ||
        phoneMatch ||
        addressMatch ||
        servicesMatch ||
        dateMatch ||
        timeMatch ||
        messageMatch
      );
    });
  };

  const filteredCustomerAppointments = filterItems(customerAppointments);
  const filteredAdminAppointments = filterItems(adminAppointments);
  const filteredQuoteRequests = filterItems(quoteRequests);
  const filteredContactSubmissions = filterItems(contactSubmissions);

  // Loading and Error states for the overall profile page
  if (authLoading)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading profile...</p>
      </div>
    );
  if (!user)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">You must be logged in to view this page.</p>
      </div>
    );
  if (!user.emailVerified && !isOwner) // Only check for email verification for regular users
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">Please verify your email to access your profile.</p>
      </div>
    );

  // Render Owner Dashboard
  if (isOwner) {
    if (loadingAdminData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-loadingText">Loading admin dashboard data...</p>
        </div>
      );
    if (errorAdminData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-errorMessage">{errorAdminData}</p>
        </div>
      );

    return (
      <>
        <div className="Profile-wrapper">
          <ProfileHeader user={user} isOwner={isOwner} /> {/* Pass user and isOwner */}
          <div className="Profile-main-container">
            <div className="Profile-search-bar-container">
              <input
                type="text"
                placeholder="Search by name, email, phone, address, etc."
                className="Profile-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="Profile-tabs-container">
              <button
                className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                Appointments ({filteredAdminAppointments.length})
              </button>
              <button
                className={`Profile-tab-button ${activeTab === 'quotes' ? 'active' : ''}`}
                onClick={() => setActiveTab('quotes')}
              >
                Quote Requests ({filteredQuoteRequests.length})
              </button>
              <button
                className={`Profile-tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                Contact Submissions ({filteredContactSubmissions.length})
              </button>
              <button
                className={`Profile-tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Profile Settings
              </button>
            </div>
            <div className="Profile-tab-content">
              <div className="Profile-tab-panel Profile-card-base">
                {activeTab === 'appointments' && (
                  <ProfileAppointments
                    appointments={filteredAdminAppointments}
                    isOwner={true}
                    handleViewDetails={handleViewAdminItemDetails}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                )}
                {activeTab === 'quotes' && (
                  <ProfileQuoteRequests
                    quoteRequests={filteredQuoteRequests}
                    handleViewDetails={handleViewAdminItemDetails}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                )}
                {activeTab === 'contacts' && (
                  <ProfileContactSubmissions
                    contactSubmissions={filteredContactSubmissions}
                    handleViewDetails={handleViewAdminItemDetails}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                )}
                {activeTab === 'settings' && <ProfileSettings user={user} db={db} />}
              </div>
            </div>
            <div className="Profile-right-column">
              <ProfileDetailsPanel
                selectedItem={selectedAdminItem}
                selectedCollection={selectedAdminCollection}
                handleCloseDetails={handleCloseDetails}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render Customer Dashboard
  if (loadingCustomerAppointments)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading your appointments...</p>
      </div>
    );
  if (errorCustomerAppointments)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">{errorCustomerAppointments}</p>
      </div>
    );

  return (
    <>
      <div className="Profile-wrapper">
        <ProfileHeader
          user={user}
          isOwner={isOwner}
          handleStartNewRequest={handleStartNewRequest}
        />
        <div className="Profile-main-container Profile-customer-layout">
          <div className="Profile-tabs-container">
            <button
              className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              My Appointments ({filteredCustomerAppointments.length})
            </button>
            <button
              className={`Profile-tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Profile Settings
            </button>
          </div>
          <div className="Profile-tab-content">
            <div className="Profile-tab-panel Profile-card-base">
              {activeTab === 'appointments' && (
                <ProfileAppointments
                  appointments={filteredCustomerAppointments}
                  isOwner={false} // Explicitly false for customer view
                  handleViewDetails={handleViewCustomerAppointmentDetails}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                />
              )}
              {activeTab === 'settings' && <ProfileSettings user={user} db={db} />}
            </div>
          </div>
          <div className="Profile-right-column">
            <ProfileDetailsPanel
              selectedItem={selectedCustomerAppointment}
              selectedCollection={'appointments'} // Always appointments for customer view
              handleCloseDetails={handleCloseDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;