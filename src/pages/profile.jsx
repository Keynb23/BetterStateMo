import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import './PageStyles.css';

const ITEMS_PER_PAGE = 5; // Define ITEMS_PER_PAGE

const Profile = () => {
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingCustomerAppointments, setLoadingCustomerAppointments] = useState(true);
  const [errorCustomerAppointments, setErrorCustomerAppointments] = useState(null);
  const [selectedCustomerAppointment, setSelectedCustomerAppointment] = useState(null);

  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [errorAdminData, setErrorAdminData] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null);

  const [showAllCustomerAppointments, setShowAllCustomerAppointments] = useState(false);
  const [showAllAdminAppointments, setShowAllAdminAppointments] = useState(false);
  const [showAllQuoteRequests, setShowAllQuoteRequests] = useState(false);
  const [showAllContactSubmissions, setShowAllContactSubmissions] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileUpdateMessage, setProfileUpdateMessage] = useState('');
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [reauthNeeded, setReauthNeeded] = useState(false);

  useEffect(() => {
    if (location.state && location.state.customerInfo) console.log('Customer info for pre-fill:', location.state.customerInfo);
  }, [location.state]);

  useEffect(() => {
    if (!authLoading && user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      const fetchUserProfile = async () => {
        if (db && user.uid) {
          const userProfileRef = doc(db, 'userProfiles', user.uid);
          onSnapshot(userProfileRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                setPhone(data.phone || '');
                setAddress(data.address || '');
              } else {
                console.log('No user profile found in Firestore for this user.');
                setPhone('');
                setAddress('');
              }
            },
            (error) => console.error('Error fetching user profile:', error)
          );
        }
      };
      fetchUserProfile();
    }
  }, [user, authLoading, db]);

  useEffect(() => {
    if (!authLoading && user && !isOwner && user.email && db) {
      setLoadingCustomerAppointments(true);
      setErrorCustomerAppointments(null);
      const q = query(collection(db, 'appointments'), where('email', '==', user.email));
      const unsubscribe = onSnapshot(q,
        (querySnapshot) => {
          const appointments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCustomerAppointments(appointments);
          setLoadingCustomerAppointments(false);
        },
        (error) => {
          console.error('Error fetching customer appointments:', error);
          setErrorCustomerAppointments('Failed to load your past appointments.');
          setLoadingCustomerAppointments(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, db, isOwner, authLoading]);

  useEffect(() => {
    if (!authLoading && user && isOwner && db) {
      setLoadingAdminData(true);
      setErrorAdminData(null);
      const unsubscribes = [];

      const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'),
        (querySnapshot) => setAdminAppointments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
        (error) => {
          console.error('Error fetching admin appointments:', error);
          setErrorAdminData('Failed to load admin appointments.');
        }
      );
      unsubscribes.push(unsubscribeAppointments);

      const unsubscribeQuotes = onSnapshot(collection(db, 'quoteRequests'),
        (querySnapshot) => setQuoteRequests(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
        (error) => {
          console.error('Error fetching quote requests:', error);
          setErrorAdminData('Failed to load quote requests.');
        }
      );
      unsubscribes.push(unsubscribeQuotes);

      const unsubscribeContacts = onSnapshot(collection(db, 'contactSubmissions'),
        (querySnapshot) => {
          const contactSubmissions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          contactSubmissions.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
          setContactSubmissions(contactSubmissions);
        },
        (error) => {
          console.error('Error fetching contact submissions:', error);
          setErrorAdminData('Failed to load contact submissions.');
        }
      );
      unsubscribes.push(unsubscribeContacts);

      setLoadingAdminData(false);
      return () => unsubscribes.forEach((unsub) => unsub());
    }
  }, [user, db, isOwner, authLoading]);

  const handleStartNewRequest = () => {
    navigate('/setapt', { state: { customerInfo: { name: user.displayName || '', email: user.email || '', phone: user.phoneNumber || '' } } });
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

  const filterItems = (items) => {
    if (!searchTerm) return items;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const emailMatch = item.email?.toLowerCase().includes(lowerCaseSearchTerm);
      const phoneMatch = item.phone?.toLowerCase().includes(lowerCaseSearchTerm);
      const addressMatch = item.address?.toLowerCase().includes(lowerCaseSearchTerm);
      const dateMatch = typeof item.date === 'string' && item.date.toLowerCase().includes(lowerCaseSearchTerm);
      const timeMatch = typeof item.time === 'string' && item.time.toLowerCase().includes(lowerCaseSearchTerm);
      const messageMatch = typeof item.message === 'string' && item.message.toLowerCase().includes(lowerCaseSearchTerm);
      const servicesMatch = item.selectedServices?.some((service) => typeof service === 'string' && service.toLowerCase().includes(lowerCaseSearchTerm));

      return nameMatch || emailMatch || phoneMatch || addressMatch || servicesMatch || dateMatch || timeMatch || messageMatch;
    });
  };
  const filteredCustomerAppointments = filterItems(customerAppointments);
  const filteredAdminAppointments = filterItems(adminAppointments);
  const filteredQuoteRequests = filterItems(quoteRequests);
  const filteredContactSubmissions = filterItems(contactSubmissions);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdateMessage('');
    setProfileUpdateError('');

    if (!user) {
      setProfileUpdateError('No user logged in.');
      return;
    }

    try {
      if (email !== user.email || newPassword) {
        if (!currentPassword) {
          setReauthNeeded(true);
          setProfileUpdateError('Please enter your current password to update email or password.');
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        setReauthNeeded(false);
      }

      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
        setProfileUpdateMessage((prev) => prev + 'Name updated successfully. ');
      }

      if (email !== user.email) {
        await updateEmail(user, email);
        setProfileUpdateMessage((prev) => prev + 'Email updated successfully. ');
      }

      if (newPassword) {
        if (newPassword !== confirmNewPassword) {
          setProfileUpdateError('New password and confirmation do not match.');
          return;
        }
        await updatePassword(user, newPassword);
        setProfileUpdateMessage((prev) => prev + 'Password updated successfully. ');
        setNewPassword('');
        setConfirmNewPassword('');
      }

      const userProfileRef = doc(db, 'userProfiles', user.uid);
      const profileUpdates = {};
      if (phone !== (user.phoneNumber || '')) profileUpdates.phone = phone;
      if (address !== (user.address || '')) profileUpdates.address = address;

      if (Object.keys(profileUpdates).length > 0) {
        await updateDoc(userProfileRef, profileUpdates, { merge: true });
        setProfileUpdateMessage((prev) => prev + 'Phone and/or Address updated successfully. ');
      }

      setCurrentPassword('');
      setProfileUpdateMessage(profileUpdateMessage || 'Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/requires-recent-login') {
        setReauthNeeded(true);
        setProfileUpdateError('This action requires recent authentication. Please enter your current password and try again.');
      } else if (error.code === 'auth/invalid-email') {
        setProfileUpdateError('The email address is not valid.');
      } else if (error.code === 'auth/weak-password') {
        setProfileUpdateError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/email-already-in-use') {
        setProfileUpdateError('This email is already in use by another account.');
      } else if (error.code === 'auth/wrong-password') {
        setProfileUpdateError('Incorrect current password.');
      } else {
        setProfileUpdateError(`Failed to update profile: ${error.message}`);
      }
    }
  };

  if (authLoading) return (<div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading profile...</p></div>);
  if (!user) return (<div className="Profile-loadingWrapper"><p className="Profile-errorMessage">You must be logged in to view this page.</p></div>);
  if (isOwner) {
    if (loadingAdminData) return (<div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading admin dashboard data...</p></div>);
    if (errorAdminData) return (<div className="Profile-loadingWrapper"><p className="Profile-errorMessage">{errorAdminData}</p></div>);
    return (
      <>
        
        <div className="Profile-wrapper">
          <div className="Profile-Dashboard-Dashboard Profile-card-base">
            <h2 className="Profile-Dashboard-title">Owner Dashboard</h2>
            <div className="Profile-Dashboard-card">
              <h3 className="Profile-Dashboard-subtitle">Welcome, Owner!</h3>
              <p className="Profile-Dashboard-text">This is your administrative dashboard.</p>
            </div>
          </div>

          <div className="Profile-main-container">
            <div className="Profile-search-bar-container">
              <input type="text" placeholder="Search by name, email, phone, address, etc." className="Profile-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="Profile-tabs-container">
              <button className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => { setActiveTab('appointments'); setEditMode(false); setShowAllAdminAppointments(false); }}>Appointments ({filteredAdminAppointments.length})</button>
              <button className={`Profile-tab-button ${activeTab === 'quotes' ? 'active' : ''}`} onClick={() => { setActiveTab('quotes'); setEditMode(false); setShowAllQuoteRequests(false); }}>Quote Requests ({filteredQuoteRequests.length})</button>
              <button className={`Profile-tab-button ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => { setActiveTab('contacts'); setEditMode(false); setShowAllContactSubmissions(false); }}>Contact Submissions ({filteredContactSubmissions.length})</button>
              <button className={`Profile-tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setEditMode(true); setShowAllAdminAppointments(false); setShowAllQuoteRequests(false); setShowAllContactSubmissions(false); }}>Profile Settings</button>
            </div>

            <div className="Profile-tab-content">
              <div className="Profile-tab-panel Profile-card-base">
                {activeTab === 'appointments' && (
                  <>
                    <h3 className="Profile-Appointments-subtitle">All Appointments</h3>
                    {filteredAdminAppointments.length === 0 ? (<p className="Profile-Appointments-message">No appointments found matching your search.</p>) : (
                      <>
                        <ul className="Profile-Appointments-list Profile-Appointments-dividedList">
                          {(showAllAdminAppointments ? filteredAdminAppointments : filteredAdminAppointments.slice(0, ITEMS_PER_PAGE)).map((apt) => (
                            <li key={apt.id} className="Profile-Appointments-listItem Profile-Appointments-dividedListItem Profile-Appointments-clickableItem" onClick={() => handleViewAdminItemDetails(apt, 'appointments')}>
                              <p className="Profile-appointmentTitle">Appointment for {apt.name} on {apt.date} at {apt.time}</p>
                              <p className="Profile-appointmentDetail">Email: {apt.email}, Phone: {apt.phone}</p>
                              <p className="Profile-appointmentDetail Profile-Appointments-smallText">Address: {apt.address}</p>
                              <p className="Profile-appointmentDetail Profile-Appointments-smallText">Services: {apt.selectedServices?.join(', ')}</p>
                            </li>
                          ))}
                        </ul>
                        {filteredAdminAppointments.length > ITEMS_PER_PAGE && (<div className="Profile-showMore-container"><button onClick={() => setShowAllAdminAppointments(!showAllAdminAppointments)} className="Profile-button Profile-showMoreBtn">{showAllAdminAppointments ? 'Show Less' : 'Show All'}</button></div>)}
                      </>
                    )}
                  </>
                )}

                {activeTab === 'quotes' && (
                  <>
                    <h3 className="Profile-Quote-subtitle">All Quote Requests</h3>
                    {filteredQuoteRequests.length === 0 ? (<p className="Profile-Quote-message">No quote requests found matching your search.</p>) : (
                      <>
                        <ul className="Profile-Quote-list Profile-Quote-dividedList">
                          {(showAllQuoteRequests ? filteredQuoteRequests : filteredQuoteRequests.slice(0, ITEMS_PER_PAGE)).map((quote) => (
                            <li key={quote.id} className="Profile-Quote-listItem Profile-Quote-dividedListItem Profile-Quote-clickableItem" onClick={() => handleViewAdminItemDetails(quote, 'quoteRequests')}>
                              <p className="Profile-quoteTitle">Quote from {quote.name}</p>
                              <p className="Profile-quoteDetail">Email: {quote.email}, Phone: {quote.phone}</p>
                              <p className="Profile-quoteDetail Profile-Quote-smallText">Message: {quote.message}</p>
                            </li>
                          ))}
                        </ul>
                        {filteredQuoteRequests.length > ITEMS_PER_PAGE && (<div className="Profile-showMore-container"><button onClick={() => setShowAllQuoteRequests(!showAllQuoteRequests)} className="Profile-button Profile-showMoreBtn">{showAllQuoteRequests ? 'Show Less' : 'Show All'}</button></div>)}
                      </>
                    )}
                  </>
                )}

                {activeTab === 'contacts' && (
                  <>
                    <h3 className="Profile-Contact-subtitle">All Contact Submissions</h3>
                    {filteredContactSubmissions.length === 0 ? (<p className="Profile-Contact-message">No contact submissions found matching your search.</p>) : (
                      <>
                        <ul className="Profile-Contact-list Profile-Contact-dividedList">
                          {(showAllContactSubmissions ? filteredContactSubmissions : filteredContactSubmissions.slice(0, ITEMS_PER_PAGE)).map((contact) => (
                            <li key={contact.id} className="Profile-Contact-listItem Profile-Contact-dividedListItem Profile-Contact-clickableItem" onClick={() => handleViewAdminItemDetails(contact, 'contactSubmissions')}>
                              <p className="Profile-contactTitle">Contact from {contact.name}</p>
                              <p className="Profile-contactDetail">Email: {contact.email}, Phone: {contact.phone}</p>
                              <p className="Profile-contactDetail Profile-Contact-smallText">Message: {contact.message}</p>
                            </li>
                          ))}
                        </ul>
                        {filteredContactSubmissions.length > ITEMS_PER_PAGE && (<div className="Profile-showMore-container"><button onClick={() => setShowAllContactSubmissions(!showAllContactSubmissions)} className="Profile-button Profile-showMoreBtn">{showAllContactSubmissions ? 'Show Less' : 'Show All'}</button></div>)}
                      </>
                    )}
                  </>
                )}

                {activeTab === 'settings' && (
                  <div className="Profile-Settings-container">
                    <h3 className="Profile-Settings-subtitle">Update Your Profile</h3>
                    {profileUpdateMessage && (<p className="Profile-successMessage">{profileUpdateMessage}</p>)}
                    {profileUpdateError && (<p className="Profile-errorMessage">{profileUpdateError}</p>)}
                    <form onSubmit={handleProfileUpdate} className="Profile-form">
                      <div className="Profile-form-group"><label htmlFor="name">Name:</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                      <div className="Profile-form-group"><label htmlFor="email">Email:</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                      <div className="Profile-form-group"><label htmlFor="phone">Phone Number:</label><input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                      <div className="Profile-form-group"><label htmlFor="address">Address:</label><input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                      <div className="Profile-form-group"><label htmlFor="newPassword">New Password (leave blank to keep current):</label><input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                      <div className="Profile-form-group"><label htmlFor="confirmNewPassword">Confirm New Password:</label><input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="Profile-input" disabled={!editMode} /></div>

                      {(reauthNeeded || email !== user.email || newPassword) && (
                        <div className="Profile-form-group">
                          <label htmlFor="currentPassword">Current Password (required for email/password changes):</label>
                          <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="Profile-input" required={reauthNeeded || email !== user.email || newPassword} />
                        </div>
                      )}

                      <div className="Profile-buttons-container">
                        {!editMode ? (<button type="button" onClick={() => setEditMode(true)} className="Profile-button Profile-editBtn">Edit Profile</button>) : (
                          <>
                            <button type="submit" className="Profile-button Profile-saveBtn">Save Changes</button>
                            <button type="button" onClick={async () => {
                                setEditMode(false);
                                setName(user.displayName || '');
                                setEmail(user.email || '');
                                const fetchUserProfileOnCancel = async () => {
                                  if (db && user.uid) {
                                    const userProfileRef = doc(db, 'userProfiles', user.uid);
                                    const docSnap = await getDoc(userProfileRef);
                                    if (docSnap.exists()) {
                                      const data = docSnap.data();
                                      setPhone(data.phone || '');
                                      setAddress(data.address || '');
                                    } else {
                                      setPhone('');
                                      setAddress('');
                                    }
                                  }
                                };
                                await fetchUserProfileOnCancel();
                                setNewPassword('');
                                setConfirmNewPassword('');
                                setCurrentPassword('');
                                setProfileUpdateMessage('');
                                setProfileUpdateError('');
                                setReauthNeeded(false);
                              }}
                              className="Profile-button Profile-cancelBtn">Cancel</button>
                          </>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="Profile-right-column">
              {selectedAdminItem && (
                <div className="Profile-details-panel Profile-card-base">
                  <h3 className="Profile-detail-subtitle">Details for {selectedAdminCollection === 'appointments' ? 'Appointment' : selectedAdminCollection === 'quoteRequests' ? 'Quote Request' : 'Contact Submission'}</h3>
                  {selectedAdminItem.name && (<p><strong>Name:</strong> {selectedAdminItem.name}</p>)}
                  {selectedAdminItem.email && (<p><strong>E</strong></p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Customer-specific rendering (if not owner)
  if (!user.emailVerified) return (<div className="Profile-loadingWrapper"><p className="Profile-errorMessage">Please verify your email to access your profile.</p></div>);
  if (loadingCustomerAppointments) return (<div className="Profile-loadingWrapper"><p className="Profile-loadingText">Loading your appointments...</p></div>);
  if (errorCustomerAppointments) return (<div className="Profile-loadingWrapper"><p className="Profile-errorMessage">{errorCustomerAppointments}</p></div>);

  return (
    <>
      
      <div className="Profile-wrapper">
        <div className="Profile-Dashboard-Dashboard Profile-card-base">
          <h2 className="Profile-Dashboard-title">My Dashboard</h2>
          <div className="Profile-Dashboard-card">
            <h3 className="Profile-Dashboard-subtitle">Welcome, {user.displayName || user.email}!</h3>
            <p className="Profile-Dashboard-text">Here you can manage your appointments and profile settings.</p>
            <button onClick={handleStartNewRequest} className="Profile-button Profile-newRequestBtn">Start a New Appointment/Quote Request</button>
          </div>
        </div>

        <div className="Profile-main-container Profile-customer-layout">
          <div className="Profile-tabs-container">
            <button className={`Profile-tab-button ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => { setActiveTab('appointments'); setEditMode(false); setShowAllCustomerAppointments(false); }}>My Appointments ({filteredCustomerAppointments.length})</button>
            <button className={`Profile-tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setEditMode(true); setShowAllCustomerAppointments(false); }}>Profile Settings</button>
          </div>

          <div className="Profile-tab-content">
            <div className="Profile-tab-panel Profile-card-base">
              {activeTab === 'appointments' && (
                <>
                  <h3 className="Profile-Appointments-subtitle">Your Past Appointments</h3>
                  {filteredCustomerAppointments.length === 0 ? (<p className="Profile-Appointments-message">You have no past appointments.</p>) : (
                    <>
                      <ul className="Profile-Appointments-list Profile-Appointments-dividedList">
                        {(showAllCustomerAppointments ? filteredCustomerAppointments : filteredCustomerAppointments.slice(0, ITEMS_PER_PAGE)).map((apt) => (
                          <li key={apt.id} className="Profile-Appointments-listItem Profile-Appointments-dividedListItem Profile-Appointments-clickableItem" onClick={() => handleViewCustomerAppointmentDetails(apt)}>
                            <p className="Profile-appointmentTitle">Appointment on {apt.date} at {apt.time}</p>
                            <p className="Profile-appointmentDetail">Service: {apt.selectedServices?.join(', ')}</p>
                          </li>
                        ))}
                      </ul>
                      {filteredCustomerAppointments.length > ITEMS_PER_PAGE && (<div className="Profile-showMore-container"><button onClick={() => setShowAllCustomerAppointments(!showAllCustomerAppointments)} className="Profile-button Profile-showMoreBtn">{showAllCustomerAppointments ? 'Show Less' : 'Show All'}</button></div>)}
                    </>
                  )}
                </>
              )}

              {activeTab === 'settings' && (
                <div className="Profile-Settings-container">
                  <h3 className="Profile-Settings-subtitle">Update Your Profile</h3>
                  {profileUpdateMessage && (<p className="Profile-successMessage">{profileUpdateMessage}</p>)}
                  {profileUpdateError && (<p className="Profile-errorMessage">{profileUpdateError}</p>)}
                  <form onSubmit={handleProfileUpdate} className="Profile-form">
                    <div className="Profile-form-group"><label htmlFor="name">Name:</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                    <div className="Profile-form-group"><label htmlFor="email">Email:</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                    <div className="Profile-form-group"><label htmlFor="phone">Phone Number:</label><input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                    <div className="Profile-form-group"><label htmlFor="address">Address:</label><input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                    <div className="Profile-form-group"><label htmlFor="newPassword">New Password (leave blank to keep current):</label><input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="Profile-input" disabled={!editMode} /></div>
                    <div className="Profile-form-group"><label htmlFor="confirmNewPassword">Confirm New Password:</label><input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="Profile-input" disabled={!editMode} /></div>

                    {(reauthNeeded || email !== user.email || newPassword) && (
                      <div className="Profile-form-group">
                        <label htmlFor="currentPassword">Current Password (required for email/password changes):</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="Profile-input" required={reauthNeeded || email !== user.email || newPassword} />
                      </div>
                    )}

                    <div className="Profile-buttons-container">
                      {!editMode ? (<button type="button" onClick={() => setEditMode(true)} className="Profile-button Profile-editBtn">Edit Profile</button>) : (
                        <>
                          <button type="submit" className="Profile-button Profile-saveBtn">Save Changes</button>
                          <button type="button" onClick={async () => {
                              setEditMode(false);
                              setName(user.displayName || '');
                              setEmail(user.email || '');
                              const fetchUserProfileOnCancel = async () => {
                                if (db && user.uid) {
                                  const userProfileRef = doc(db, 'userProfiles', user.uid);
                                  const docSnap = await getDoc(userProfileRef);
                                  if (docSnap.exists()) {
                                    const data = docSnap.data();
                                    setPhone(data.phone || '');
                                    setAddress(data.address || '');
                                  } else {
                                    setPhone('');
                                    setAddress('');
                                  }
                                }
                              };
                              await fetchUserProfileOnCancel();
                              setNewPassword('');
                              setConfirmNewPassword('');
                              setCurrentPassword('');
                              setProfileUpdateMessage('');
                              setProfileUpdateError('');
                              setReauthNeeded(false);
                            }}
                            className="Profile-button Profile-cancelBtn">Cancel</button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="Profile-right-column">
            {selectedCustomerAppointment && (
              <div className="Profile-details-panel Profile-card-base">
                <h3 className="Profile-detail-subtitle">Appointment Details</h3>
                <p><strong>Name:</strong> {selectedCustomerAppointment.name}</p>
                <p><strong>Email:</strong> {selectedCustomerAppointment.email}</p>
                <p><strong>Phone:</strong> {selectedCustomerAppointment.phone}</p>
                <p><strong>Address:</strong> {selectedCustomerAppointment.address}</p>
                <p><strong>Date:</strong> {selectedCustomerAppointment.date}</p>
                <p><strong>Time:</strong> {selectedCustomerAppointment.time}</p>
                <p><strong>Services:</strong> {selectedCustomerAppointment.selectedServices?.join(', ')}</p>
                <p><strong>Message:</strong> {selectedCustomerAppointment.message || 'N/A'}</p>
                <button onClick={handleCloseDetails} className="Profile-button Profile-closeBtn">Close Details</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;