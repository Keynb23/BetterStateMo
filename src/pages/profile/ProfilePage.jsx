// src/pages/ProfilePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './ProfileStyles.css'; // Ensure this path is correct

import ProfileHeader from './ProfileHeader.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import ProfileTabs from './ProfileTabs.jsx'; 

import {
  getAppointments,
  getContactSubmissions,
  getQuoteRequests,
  getCustomerAppointments,
} from '../../lib/firestoreService.js'; // Ensure this path is correct

const ProfilePage = () => {
  // Renamed component
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments'); // Default tab
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentSort, setCurrentSort] = useState('createdAtDesc');

  // State for managing selected item for details panel (handled within ProfileTabs now)
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);

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
      // Set default tab based on user type after auth loads
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

  // Handlers for viewing/closing details. These will be passed down to ProfileTabs.
  const handleViewDetails = (item, collectionName) => {
    setSelectedItem(item);
    setSelectedCollection(collectionName);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setSelectedCollection(null);
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
        // Ensure createdAt is treated as a Date object or convert it
        return sorted.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Date
              ? a.createdAt
              : a.createdAt?.toDate
                ? a.createdAt.toDate()
                : new Date(0);
          const dateB =
            b.createdAt instanceof Date
              ? b.createdAt
              : b.createdAt?.toDate
                ? b.createdAt.toDate()
                : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      case 'createdAtAsc':
        return sorted.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Date
              ? a.createdAt
              : a.createdAt?.toDate
                ? a.createdAt.toDate()
                : new Date(0);
          const dateB =
            b.createdAt instanceof Date
              ? b.createdAt
              : b.createdAt?.toDate
                ? b.createdAt.toDate()
                : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
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

  // Filtered and sorted data to pass to ProfileTabs
  const dataForTabs = {
    customerAppointments: filterAndSortItems(customerAppointments),
    adminAppointments: filterAndSortItems(adminAppointments),
    quoteRequests: filterAndSortItems(quoteRequests),
    contactSubmissions: filterAndSortItems(contactSubmissions),
  };

  if (authLoading || isLoadingData)
    return (
      <div className="loading-wrapper">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  if (!user)
    return (
      <div className="loading-wrapper">
        <p className="error-message">You must be logged in to view this page.</p>
      </div>
    );
  if (!user.emailVerified && !isOwner)
    return (
      <div className="loading-wrapper">
        <p className="error-message">Please verify your email to access your profile.</p>
      </div>
    );

  return (
    <div className="profile-page">
      {' '}
      {/* Main wrapper for the entire profile page */}
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        handleStartNewRequest={handleStartNewRequest}
        searchTerm={searchTerm} // Pass search term and handler
        setSearchTerm={setSearchTerm}
        onRefresh={fetchAllData} // Pass refresh handler
        isRefreshing={isRefreshing}
        onSortChange={setCurrentSort} // Pass sort handler
        currentSort={currentSort}
      />
      {errorData && <p className="message message--error">{errorData}</p>}
      <div className="profile-main">
        {' '}
        {/* flex column container for tabs/settings and details */}
        {/* ProfileTabs component handles tab navigation and content display for lists */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          appointments={dataForTabs.adminAppointments} // For admin
          quoteRequests={dataForTabs.quoteRequests} // For admin
          contactSubmissions={dataForTabs.contactSubmissions} // For admin
          customerAppointments={dataForTabs.customerAppointments} // For customer
          isOwner={isOwner}
          // Pass down selected item state and handlers for details panel
          selectedItem={selectedItem}
          selectedCollection={selectedCollection}
          handleViewDetails={handleViewDetails}
          handleCloseDetails={handleCloseDetails}
        />
        {/* ProfileSettings is a separate, dedicated component */}
        {activeTab === 'settings' && <ProfileSettings user={user} db={db} />}
      </div>
    </div>
  );
};

export default ProfilePage;
