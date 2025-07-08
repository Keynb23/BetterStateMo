// src/components/Profile/ProfileDetailsPanel.jsx
import './ProfileStyles.css'; // Ensure this path is correct

const ProfileDetailsPanel = ({ selectedItem, selectedCollection, handleCloseDetails }) => {
    if (!selectedItem) {
        return null; // Don't render if no item is selected
    }

    const getTitle = () => {
        switch (selectedCollection) {
            case 'appointments':
                return 'Appointment Details';
            case 'quoteRequests':
                return 'Quote Request Details';
            case 'contactSubmissions':
                return 'Contact Submission Details';
            default:
                return 'Item Details';
        }
    };

    return (
        <div className="details-panel card-base"> {/* Changed class name */}
            <h3 className="tab-section-subtitle">{getTitle()}</h3> {/* Changed class name */}
            {selectedItem.name && (
                <p>
                    <strong>Name:</strong> {selectedItem.name}
                </p>
            )}
            {selectedItem.email && (
                <p>
                    <strong>Email:</strong> {selectedItem.email}
                </p>
            )}
            {selectedItem.phone && (
                <p>
                    <strong>Phone:</strong> {selectedItem.phone}
                </p>
            )}
            {selectedItem.address && (
                <p>
                    <strong>Address:</strong> {selectedItem.address}
                </p>
            )}
            {selectedCollection === 'appointments' && (
                <>
                    {selectedItem.date && (
                        <p>
                            <strong>Date:</strong> {selectedItem.date}
                        </p>
                    )}
                    {selectedItem.time && (
                        <p>
                            <strong>Time:</strong> {selectedItem.time}
                        </p>
                    )}
                    {selectedItem.selectedServices && (
                        <p>
                            <strong>Services:</strong>{' '}
                            {selectedItem.selectedServices?.join(', ')}
                        </p>
                    )}
                </>
            )}
            {selectedItem.message && (
                <p>
                    <strong>Message:</strong> {selectedItem.message || 'N/A'}
                </p>
            )}
            {selectedItem.createdAt && (
                <p>
                    <strong>Submitted At:</strong>{' '}
                    {new Date(selectedItem.createdAt.toDate()).toLocaleString()}
                </p>
            )}
            <button onClick={handleCloseDetails} className="primary-button close-button"> {/* Changed class name */}
                Close Details
            </button>
        </div>
    );
};

export default ProfileDetailsPanel;