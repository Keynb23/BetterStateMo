import { RefreshCw, Loader2 } from 'lucide-react'; // Using Lucide React for icons
import './ProfileStyles.css';

const ProfileRefreshButton = ({ onRefresh, isLoading }) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className={`Pro-Refresh-btn ${isLoading ? 'Pro-Refresh-btn--loading' : ''}`}
      aria-label="Refresh data"
    >
      {isLoading ? (
        <Loader2 className="Pro-Refresh-btn__icon Pro-Refresh-btn__icon--animate" />
      ) : (
        <RefreshCw className="Pro-Refresh-btn__icon" />
      )}
      {isLoading ? 'Refreshing...' : 'Refresh Data'}
    </button>
  );
};

export default ProfileRefreshButton;