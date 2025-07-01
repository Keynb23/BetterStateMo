import './ProfileStyles.css';

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
    <div className="Profile-details-panel Profile-card-base">
      <h3 className="Profile-detail-subtitle">{getTitle()}</h3>
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
      <button onClick={handleCloseDetails} className="Profile-button Profile-closeBtn">
        Close Details
      </button>
    </div>
  );
};

export default ProfileDetailsPanel;