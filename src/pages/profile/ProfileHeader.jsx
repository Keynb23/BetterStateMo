// src/pages/Profile/ProfileHeader.jsx
import './ProfileStyles.css'; // Assuming styles are here
import { IoRefreshSharp } from 'react-icons/io5'; // Keeping this icon as it's desired

const ProfileHeader = ({
  user,
  isOwner,
  handleStartNewRequest,
  searchTerm,
  setSearchTerm,
  onRefresh,
  isRefreshing,
  onSortChange,
  currentSort,
}) => {
  const isAdmin = isOwner; // For clarity

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="profile-header-container">
      <div className="profile-header__background"></div>
      <div className="profile-header">
        {isAdmin ? (
          <div className="profile-header__admin-dashboard">
            <h1 className="profile-header__title">Owner Dashboard</h1>
            <p className="profile-header__welcome-message">
              Welcome, {user?.displayName || 'Admin'}!
            </p>
          </div>
        ) : (
          <div className="profile-header__user-profile">
            <h1 className="profile-header__title">Your Profile</h1>
            <p className="profile-header__subtitle">Manage your appointments and settings.</p>
          </div>
        )}

        <div className="profile-header__actions">
          <input
            type="text"
            placeholder="Search by name, email, phone, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="profile-header__search-input"
          />
          <button
            onClick={onRefresh}
            className={`profile-refresh-button ${isRefreshing ? 'profile-refresh-button--animating' : ''}`}
            title="Refresh Data"
            disabled={isRefreshing}
          >
            <IoRefreshSharp /> {/* This icon is now correctly imported from react-icons */}
          </button>

          <select value={currentSort} onChange={handleSortChange} className="profile-sort-button">
            <option value="createdAtDesc">Date Created (Newest)</option>
            <option value="createdAtAsc">Date Created (Oldest)</option>
            <option value="firstNameAsc">Customer Name (A-Z)</option>
            <option value="firstNameDesc">Customer Name (Z-A)</option>
          </select>

          {!isAdmin && (
            <button onClick={handleStartNewRequest} className="button button--primary">
              Start New Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
