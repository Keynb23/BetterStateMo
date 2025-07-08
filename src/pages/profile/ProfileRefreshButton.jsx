// src/components/Profile/ProfileRefreshButton.jsx
import { RefreshCw, Loader2 } from 'lucide-react';
import './ProfileStyles.css'; // Ensure this path is correct

const ProfileRefreshButton = ({ onRefresh, isLoading }) => {
    return (
        <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`action-button refresh-button ${isLoading ? 'loading' : ''}`} // Changed class names
            aria-label="Refresh data"
        >
            {isLoading ? (
                <Loader2 className="icon animate-spin" /> {/* Changed class name */}
            ) : (
                <RefreshCw className="icon" /> {/* Changed class name */}
            )}
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
    );
};

export default ProfileRefreshButton;