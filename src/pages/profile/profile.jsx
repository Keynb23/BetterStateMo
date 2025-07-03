import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './ProfileStyles.css';

// Import the new components
import ProfileHeader from './ProfileHeader.jsx';
import ProfileAppointments from './ProfileAppointments.jsx';
import ProfileQuoteRequests from './ProfileQuoteRequests.jsx';
import ProfileContactSubmissions from './ProfileContactSubmissions.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import ProfileDetailsPanel from './ProfileDetailsPanel.jsx';
import ProfileRefreshButton from './ProfileRefreshButton.jsx';
import ProfileSortButton from './ProfileSortButton.jsx';
import {
  getAppointments,
  getContactSubmissions,
  getQuoteRequests,
  getCustomerAppointments,
} from '../../lib/firestoreService.js'  

const ITEMS_PER_PAGE = 5;

const Profile = () => {
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);

  // Loading states
  const [isLoadingData, setIsLoadingData] = useState(true); // Combined loading for all data
  const [errorData, setErrorData] = useState(null); // Combined error for all data
  const [isRefreshing, setIsRefreshing] = useState(false); // For refresh button spinner

  // Sorting state
  const [currentSort, setCurrentSort] = useState('createdAtDesc'); // Default sort

  // Detail panel states
  const [selectedCustomerAppointment, setSelectedCustomerAppointment] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null);

  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true); // Start refreshing animation
    setErrorData(null); // Clear previous errors
    try {
      if (isOwner) {
        const [appointments, quotes, contacts] = await Promise.all([
          getAppointments(),
          getQuoteRequests(),
          getContactSubmissions(),
        ]);
        setAdminAppointments(appointments);
        setQuoteRequests(quotes);
        setContactSubmissions(contacts);
      } else if (user?.uid) {
        const customerApts = await getCustomerAppointments(user.uid);
        setCustomerAppointments(customerApts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorData('Failed to load data. Please try refreshing.');
    } finally {
      setIsRefreshing(false); // End refreshing animation
      setIsLoadingData(false); // Initial load complete
    }
  }, [isOwner, user?.uid]); // Dependencies for useCallback

  // Effect to fetch data on mount and when user/owner status changes
  useEffect(() => {
    if (!authLoading && db) { // Ensure Firebase is initialized and user auth state is known
      fetchAllData();
    }
  }, [authLoading, db, fetchAllData]);

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

  const handleStartNewRequest = () => {
    navigate('/setapt', {
      state: {
        customerInfo: {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
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

  // Sorting Logic
  const sortData = (data, sortCriteria) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data]; // Create a shallow copy to avoid mutating original state

    switch (sortCriteria) {
      case 'firstNameAsc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'firstNameDesc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'lastNameAsc':
        return sorted.sort((a, b) => {
          const getLastName = (fullName) => fullName?.split(' ').pop() || '';
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
      case 'lastNameDesc':
        return sorted.sort((a, b) => {
          const getLastName = (fullName) => fullName?.split(' ').pop() || '';
          return getLastName(b.name).localeCompare(getLastName(a.name));
        });
      case 'createdAtDesc':
        // Ensure createdAt is a Date object for comparison
        return sorted.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      case 'createdAtAsc':
        return sorted.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
      default:
        return sorted; // Return default order (which is usually createdAtDesc from fetch)
    }
  };

  // Filter and Sort combined
  const filterAndSortItems = (items) => {
    const filtered = items.filter((item) => {
      if (!searchTerm) return true;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const fieldsToSearch = [
        item.name,
        item.email,
        item.phone,
        item.address,
        item.message,
        item.date, // For appointments
        item.time, // For appointments
        ...(item.selectedServices || []), // For appointments
        item.zipCode, // For quotes
        item.serviceType // For quotes
      ];
      return fieldsToSearch.some(field =>
        typeof field === 'string' && field.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    return sortData(filtered, currentSort);
  };


  const filteredAndSortedCustomerAppointments = filterAndSortItems(customerAppointments);
  const filteredAndSortedAdminAppointments = filterAndSortItems(adminAppointments);
  const filteredAndSortedQuoteRequests = filterAndSortItems(quoteRequests);
  const filteredAndSortedContactSubmissions = filterAndSortItems(contactSubmissions);

  // Loading and Error states for the overall profile page
  if (authLoading || isLoadingData)
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
  if (!user.emailVerified && !isOwner)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">Please verify your email to access your profile.</p>
      </div>
    );

  // Render Owner Dashboard
  if (isOwner) {
    if (errorData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-errorMessage">{errorData}</p>
        </div>
      );

    return (
      <>
        <div className="Profile-wrapper">
          <ProfileHeader user={user} isOwner={isOwner} />
          <div className="Profile-main-container">
            <div className="Profile-controls-row flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search by name, email, phone, address, etc."
                className="Profile-search-input flex-grow mr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ProfileRefreshButton onRefresh={fetchAllData} isLoading={isRefreshing} />
              <ProfileSortButton onSortChange={setCurrentSort} currentSort={currentSort} />
            </div>
            <div className="Profile-tabs-container">
              <button
                className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                Appointments ({filteredAndSortedAdminAppointments.length})
              </button>
              <button
                className={`Profile-tab-button ${activeTab === 'quotes' ? 'active' : ''}`}
                onClick={() => setActiveTab('quotes')}
              >
                Quote Requests ({filteredAndSortedQuoteRequests.length})
              </button>
              <button
                className={`Profile-tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                Contact Submissions ({filteredAndSortedContactSubmissions.length})
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
                    appointments={filteredAndSortedAdminAppointments}
                    isOwner={true}
                    handleViewDetails={handleViewAdminItemDetails}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                )}
                {activeTab === 'quotes' && (
                  <ProfileQuoteRequests
                    quoteRequests={filteredAndSortedQuoteRequests}
                    handleViewDetails={handleViewAdminItemDetails}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  />
                )}
                {activeTab === 'contacts' && (
                  <ProfileContactSubmissions
                    contactSubmissions={filteredAndSortedContactSubmissions}
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
  if (errorData)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">{errorData}</p>
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
          <div className="Profile-controls-row flex justify-end items-center mb-4">
            <ProfileRefreshButton onRefresh={fetchAllData} isLoading={isRefreshing} />
          </div>
          <div className="Profile-tabs-container">
            <button
              className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              My Appointments ({filteredAndSortedCustomerAppointments.length})
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
                  appointments={filteredAndSortedCustomerAppointments}
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
