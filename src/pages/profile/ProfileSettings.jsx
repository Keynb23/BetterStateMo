// pages/ProfileSettings.jsx
import React, { useState, useEffect } from 'react'; // Added React import for clarity
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Added deleteDoc
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential redirection
import './ProfileStyles.css';

const ProfileSettings = ({ user, db }) => {
  const navigate = useNavigate(); // Initialize useNavigate
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

  // State to hold initial data for display mode and for resetting on cancel
  const [initialProfileData, setInitialProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Effect to load user profile data when user or db changes
  useEffect(() => {
    if (user && db) {
      const fetchUserProfile = async () => {
        const userProfileRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(userProfileRef);

        let fetchedPhone = '';
        let fetchedAddress = '';
        if (docSnap.exists()) {
          const data = docSnap.data();
          fetchedPhone = data.phone || '';
          fetchedAddress = data.address || '';
        } else {
          console.log('No user profile found in Firestore for this user.');
          // If no profile, ensure phone/address are empty
        }

        // Set state for form inputs
        setName(user.displayName || '');
        setEmail(user.email || '');
        setPhone(fetchedPhone);
        setAddress(fetchedAddress);
        setCurrentPassword(''); // Clear current password on initial load or cancel
        setNewPassword('');
        setConfirmNewPassword('');

        // Set initial data for display mode and for resetting the form
        setInitialProfileData({
          name: user.displayName || '',
          email: user.email || '',
          phone: fetchedPhone,
          address: fetchedAddress,
        });
      };
      fetchUserProfile();
    }
  }, [user, db]); // Depend on user and db

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdateMessage('');
    setProfileUpdateError('');

    if (!user) {
      setProfileUpdateError('No user logged in.');
      return;
    }

    try {
      // Reauthentication check for email/password changes
      if (email !== initialProfileData.email || newPassword) {
        if (!currentPassword) {
          setReauthNeeded(true);
          setProfileUpdateError('Please enter your current password to update email or password.');
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        setReauthNeeded(false); // Reauthentication successful
      }

      let changesMade = false;
      let messages = [];

      // Update Firebase Auth profile (displayName, email, password)
      if (name !== initialProfileData.name) {
        await updateProfile(user, { displayName: name });
        messages.push('Name updated successfully.');
        changesMade = true;
      }

      if (email !== initialProfileData.email) {
        await updateEmail(user, email);
        messages.push('Email updated successfully. ');
        changesMade = true;
      }

      if (newPassword) {
        if (newPassword !== confirmNewPassword) {
          setProfileUpdateError('New password and confirmation do not match.');
          return;
        }
        if (newPassword.length < 6) {
          setProfileUpdateError('Password should be at least 6 characters.');
          return;
        }
        await updatePassword(user, newPassword);
        messages.push('Password updated successfully. ');
        setNewPassword('');
        setConfirmNewPassword('');
        changesMade = true;
      }

      // Update Firestore user profile (phone, address)
      const userProfileRef = doc(db, 'userProfiles', user.uid);
      const profileUpdates = {};

      if (phone !== initialProfileData.phone) {
        profileUpdates.phone = phone;
        changesMade = true;
      }
      if (address !== initialProfileData.address) {
        profileUpdates.address = address;
        changesMade = true;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await updateDoc(userProfileRef, profileUpdates, { merge: true });
        messages.push('Phone and/or Address updated successfully. ');
      }

      setCurrentPassword(''); // Clear current password after successful update
      setProfileUpdateMessage(messages.join('\n') || 'No changes detected.'); // Join messages with newline
      setEditMode(false);

      // Re-fetch and update initialProfileData after successful updates
      if (changesMade) {
        // A small delay to allow Firebase Auth changes to propagate if needed
        setTimeout(async () => {
          const userProfileRefAfterUpdate = doc(db, 'userProfiles', user.uid);
          const docSnapAfterUpdate = await getDoc(userProfileRefAfterUpdate);
          let newFetchedPhone = '';
          let newFetchedAddress = '';
          if (docSnapAfterUpdate.exists()) {
            const data = docSnapAfterUpdate.data();
            newFetchedPhone = data.phone || '';
            newFetchedAddress = data.address || '';
          }
          setInitialProfileData({
            name: user.displayName || name, // Use current display name from auth, or local state if auth not yet propagated
            email: user.email || email, // Use current email from auth
            phone: newFetchedPhone,
            address: newFetchedAddress,
          });
        }, 500); // Adjust delay if needed
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/requires-recent-login') {
        setReauthNeeded(true);
        setProfileUpdateError(
          'This action requires recent authentication. Please enter your current password and try again.',
        );
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

  const handleCancel = async () => {
    setEditMode(false);
    setProfileUpdateMessage('');
    setProfileUpdateError('');
    setReauthNeeded(false);

    // Reset form fields to initial loaded data
    setName(initialProfileData.name);
    setEmail(initialProfileData.email);
    setPhone(initialProfileData.phone);
    setAddress(initialProfileData.address);
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPassword('');
  };

  const handleDeleteProfile = async () => {
    if (!user) {
      setProfileUpdateError('No user logged in to delete.');
      return;
    }

    const isConfirmed = window.confirm(
      'Are you sure you want to delete your profile information? This action cannot be undone. Your past appointments and requests will remain, but your personal details linked to this profile will be removed.'
    );

    if (!isConfirmed) {
      return;
    }

    try {
      // Delete the user's document from the 'userProfiles' collection
      const userProfileRef = doc(db, 'userProfiles', user.uid);
      await deleteDoc(userProfileRef);

      setProfileUpdateMessage('Profile information successfully deleted.');
      setProfileUpdateError('');

      setPhone('');
      setAddress('');
      setInitialProfileData((prev) => ({
        ...prev,
        phone: '',
        address: '',
      }));

      // Optionally, you might want to redirect the user or prompt them to log out
      // For now, the UI will simply reflect the empty phone/address fields.
      // navigate('/some-other-page');
    } catch (error) {
      console.error('Error deleting profile information:', error);
      setProfileUpdateError(`Failed to delete profile: ${error.message}`);
    }
  };

  return (
    <div className="Profile-Settings-container Profile-card-base">
      <h3 className="Profile-Settings-subtitle">Profile Settings</h3>
      {profileUpdateMessage && (
        <p className="Profile-successMessage">{profileUpdateMessage}</p>
      )}
      {profileUpdateError && (
        <p className="Profile-errorMessage">{profileUpdateError}</p>
      )}

      {/* Buttons for default view (hidden in edit mode) */}
      {!editMode && (
        <div className="Profile-actions-buttons Profile-actions-top-buttons">
          <button
            type="button"
            onClick={() => {
              setEditMode(true);
              setProfileUpdateMessage(''); // Clear messages when entering edit mode
              setProfileUpdateError('');
            }}
            className="Profile-button Profile-editBtn"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="Profile-button Profile-deleteBtn"
          >
            Delete Profile
          </button>
        </div>
      )}

      {/* Conditional Rendering based on editMode */}
      {!editMode ? (
        // Display Mode
        <div className="Profile-display-info">
          <div className="Profile-info-group">
            <span className="Profile-info-label">Name:</span>
            <span className="Profile-info-value">{initialProfileData.name || 'N/A'}</span>
          </div>
          <div className="Profile-info-group">
            <span className="Profile-info-label">Email:</span>
            <span className="Profile-info-value">{initialProfileData.email || 'N/A'}</span>
          </div>
          <div className="Profile-info-group">
            <span className="Profile-info-label">Phone Number:</span>
            <span className="Profile-info-value">{initialProfileData.phone || 'N/A'}</span>
          </div>
          <div className="Profile-info-group">
            <span className="Profile-info-label">Address:</span>
            <span className="Profile-info-value">{initialProfileData.address || 'N/A'}</span>
          </div>
          <div className="Profile-info-group">
            <span className="Profile-info-label">Password:</span>
            <span className="Profile-info-value">********</span> {/* Masked password */}
          </div>
        </div>
      ) : (
        // Edit Mode (Form)
        <form onSubmit={handleProfileUpdate} className="Profile-form">
          <div className="Profile-form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="Profile-input"
            />
          </div>
          <div className="Profile-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="Profile-input"
            />
          </div>
          <div className="Profile-form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="Profile-input"
            />
          </div>
          <div className="Profile-form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="Profile-input"
            />
          </div>
          <div className="Profile-form-group">
            <label htmlFor="newPassword">
              New Password (leave blank to keep current):
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="Profile-input"
              autoComplete="new-password" // Helps browsers suggest strong passwords
            />
          </div>
          <div className="Profile-form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="Profile-input"
              autoComplete="new-password"
            />
          </div>
          {(reauthNeeded || email !== initialProfileData.email || newPassword) && (
            <div className="Profile-form-group">
              <label htmlFor="currentPassword">
                Current Password (required for email/password changes):
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="Profile-input"
                required={reauthNeeded || email !== initialProfileData.email || newPassword}
                autoComplete="current-password"
              />
            </div>
          )}
          {/* Save and Cancel buttons for edit mode (hidden in display mode) */}
          <div className="Profile-buttons-container Profile-actions-bottom-buttons">
            <button type="submit" className="Profile-button Profile-saveBtn">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="Profile-button Profile-cancelBtn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;