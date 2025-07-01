
import './ProfileStyles.css';

const ProfileHeader = ({ user, isOwner, handleStartNewRequest }) => {
  return (
    <div className="Profile-Dashboard-Dashboard Profile-card-base">
      <h2 className="Profile-Dashboard-title">
        {isOwner ? 'Owner Dashboard' : 'My Dashboard'}
      </h2>
      <div className="Profile-Dashboard-card">
        <h3 className="Profile-Dashboard-subtitle">
          Welcome, {user.displayName || user.email}!
        </h3>
        <p className="Profile-Dashboard-text">
          {isOwner
            ? 'This is your administrative dashboard.'
            : '=====NOT DONE STYLING=======Here you can manage your appointments and profile settings.'}
        </p>
        {!isOwner && (
          <button onClick={handleStartNewRequest} className="Dashboard-newRequestBtn">
            Start a New Appointment/Quote Request
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;