import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './ProfileStyles.css';

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
} from '../../lib/firestoreService.js';

const ITEMS_PER_PAGE = 5;

const Profile = () => {
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentSort, setCurrentSort] = useState('createdAtDesc');

  const [selectedCustomerAppointment, setSelectedCustomerAppointment] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null);

  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true);
    setErrorData(null);
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
      setIsRefreshing(false);
      setIsLoadingData(false);
    }
  }, [isOwner, user?.uid]);

  useEffect(() => {
    if (!authLoading && db) {
      fetchAllData();
    }
  }, [authLoading, db, fetchAllData]);

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
    setSelectedAdminItem(null);
  };

  const handleViewAdminItemDetails = (item, collectionName) => {
    setSelectedAdminItem(item);
    setSelectedAdminCollection(collectionName);
    setSelectedCustomerAppointment(null);
  };

  const handleCloseDetails = () => {
    setSelectedCustomerAppointment(null);
    setSelectedAdminItem(null);
    setSelectedAdminCollection(null);
  };

  const sortData = (data, sortCriteria) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data];

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
        return sorted.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      case 'createdAtAsc':
        return sorted.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
      default:
        return sorted;
    }
  };

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
        item.date,
        item.time,
        ...(item.selectedServices || []),
        item.zipCode,
        item.serviceType,
      ];
      return fieldsToSearch.some(
        (field) => typeof field === 'string' && field.toLowerCase().includes(lowerCaseSearchTerm),
      );
    });
    return sortData(filtered, currentSort);
  };

  const filteredAndSortedCustomerAppointments = filterAndSortItems(customerAppointments);
  const filteredAndSortedAdminAppointments = filterAndSortItems(adminAppointments);
  const filteredAndSortedQuoteRequests = filterAndSortItems(quoteRequests);
  const filteredAndSortedContactSubmissions = filterAndSortItems(contactSubmissions);

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

  if (isOwner) {
    if (errorData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-errorMessage">{errorData}</p>
        </div>
      );

    return (
      <>
        <div className="profile-container-wrapper">
          <div className="Profile-wrapper">
            <ProfileHeader user={user} isOwner={isOwner} />
            <div className="Profile-main-container">
              <div className="Profile-controls-row Profile-controls-row-owner">
                <input
                  type="text"
                  placeholder="Search by name, email, phone, address, etc."
                  className="Profile-search-input Profile-search-input-owner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pro-btns">
                  <ProfileRefreshButton className="pro.btns" onRefresh={fetchAllData} isLoading={isRefreshing} />
                  <ProfileSortButton className="pro.btns"  onSortChange={setCurrentSort} currentSort={currentSort} />
                </div>
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
        </div>
      </>
    );
  }

  if (errorData)
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">{errorData}</p>
      </div>
    );

  return (
    <>
      <div className="profile-container-wrapper">
        <div className="Profile-wrapper">
          <ProfileHeader
            user={user}
            isOwner={isOwner}
            handleStartNewRequest={handleStartNewRequest}
          />
          <div className="Profile-main-container Profile-customer-layout">
            <div className="Profile-controls-row Profile-controls-row-customer">
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
                    isOwner={false}
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
                selectedCollection={'appointments'}
                handleCloseDetails={handleCloseDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;