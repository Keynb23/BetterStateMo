// src/pages/Profile/ProfileTabs.jsx
import { useState} from 'react';
import './ProfileStyles.css'; // Correct: CSS is sibling

const ITEMS_PER_PAGE = 5; // Constant for items per page for lists

// ProfileDetailsPanel component: Displays detailed information about a selected item
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
    <div className="profile-details-panel card-base">
      <h3 className="profile-details-panel__title">{getTitle()}</h3>
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
              <strong>Services:</strong> {selectedItem.selectedServices?.join(', ')}
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
          {selectedItem.createdAt instanceof Date
            ? selectedItem.createdAt.toLocaleString()
            : new Date(selectedItem.createdAt.toDate()).toLocaleString()}
        </p>
      )}
      <button
        onClick={handleCloseDetails}
        className="button button--primary profile-details-panel__close-button"
      >
        Close Details
      </button>
    </div>
  );
};

// ProfileAppointments component: Displays a list of appointments
const ProfileAppointments = ({ appointments, isOwner, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedAppointments = showAll ? appointments : appointments.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="profile-tab-content">
      <h3 className="profile-tab-content__subtitle">
        {isOwner ? 'All Appointments' : 'Your Past Appointments'}
      </h3>
      {appointments.length === 0 ? (
        <p className="profile-tab-content__message">
          {isOwner
            ? 'No appointments found matching your search.'
            : 'You have no past appointments.'}
        </p>
      ) : (
        <>
          <ul className="data-list data-list--divided">
            {displayedAppointments.map((apt) => (
              <li
                key={apt.id}
                className="data-list__item data-list__item--clickable"
                onClick={() => handleViewDetails(apt, 'appointments')}
              >
                <p className="data-list__item-title">
                  {isOwner
                    ? `Appointment for ${apt.name} on ${apt.date} at ${apt.time}`
                    : `Appointment on ${apt.date} at ${apt.time}`}
                </p>
                {isOwner && (
                  <p className="data-list__item-detail">
                    Email: {apt.email}, Phone: {apt.phone}
                  </p>
                )}
                {isOwner && (
                  <p className="data-list__item-detail data-list__item-detail--small-text">
                    Address: {apt.address}
                  </p>
                )}
                <p className="data-list__item-detail data-list__item-detail--small-text">
                  Services: {apt.selectedServices?.join(', ')}
                </p>
              </li>
            ))}
          </ul>
          {appointments.length > ITEMS_PER_PAGE && (
            <div className="profile-tab-content__show-more-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="button button--primary profile-tab-content__show-more-button"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ProfileContactSubmissions component: Displays a list of contact submissions
const ProfileContactSubmissions = ({ contactSubmissions, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedContactSubmissions = showAll
    ? contactSubmissions
    : contactSubmissions.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="profile-tab-content">
      <h3 className="profile-tab-content__subtitle">All Contact Submissions</h3>
      {contactSubmissions.length === 0 ? (
        <p className="profile-tab-content__message">
          No contact submissions found matching your search.
        </p>
      ) : (
        <>
          <ul className="data-list data-list--divided">
            {displayedContactSubmissions.map((contact) => (
              <li
                key={contact.id}
                className="data-list__item data-list__item--clickable"
                onClick={() => handleViewDetails(contact, 'contactSubmissions')}
              >
                <p className="data-list__item-title">Contact from {contact.name}</p>
                <p className="data-list__item-detail">
                  Email: {contact.email}, Phone: {contact.phone}
                </p>
                <p className="data-list__item-detail data-list__item-detail--small-text">
                  Message: {contact.message}
                </p>
              </li>
            ))}
          </ul>
          {contactSubmissions.length > ITEMS_PER_PAGE && (
            <div className="profile-tab-content__show-more-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="button button--primary profile-tab-content__show-more-button"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ProfileQuoteRequests component: Displays a list of quote requests
const ProfileQuoteRequests = ({ quoteRequests, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedQuoteRequests = showAll ? quoteRequests : quoteRequests.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="profile-tab-content">
      <h3 className="profile-tab-content__subtitle">All Quote Requests</h3>
      {quoteRequests.length === 0 ? (
        <p className="profile-tab-content__message">
          No quote requests found matching your search.
        </p>
      ) : (
        <>
          <ul className="data-list data-list--divided">
            {displayedQuoteRequests.map((quote) => (
              <li
                key={quote.id}
                className="data-list__item data-list__item--clickable"
                onClick={() => handleViewDetails(quote, 'quoteRequests')}
              >
                <p className="data-list__item-title">Quote from {quote.name}</p>
                <p className="data-list__item-detail">
                  Email: {quote.email}, Phone: {quote.phone}
                </p>
                <p className="data-list__item-detail data-list__item-detail--small-text">
                  Message: {quote.message}
                </p>
              </li>
            ))}
          </ul>
          {quoteRequests.length > ITEMS_PER_PAGE && (
            <div className="profile-tab-content__show-more-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="button button--primary profile-tab-content__show-more-button"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ProfileTabs component: Manages active tab state and displays content
const ProfileTabs = ({
  activeTab,
  onTabChange,
  appointments,
  quoteRequests,
  contactSubmissions,
  customerAppointments,
  isOwner,
  selectedItem,
  selectedCollection,
  handleViewDetails,
  handleCloseDetails,
}) => {
  return (
    <div className="profile-main__content-area">
      {/* Tab navigation buttons */}
      <div className="profile-tabs__navigation">
        <button
          className={`profile-tabs__button ${activeTab === 'appointments' ? 'profile-tabs__button--active' : ''}`}
          onClick={() => onTabChange('appointments')}
        >
          Appointments
        </button>
        {isOwner && (
          <>
            <button
              className={`profile-tabs__button ${activeTab === 'quoteRequests' ? 'profile-tabs__button--active' : ''}`}
              onClick={() => onTabChange('quoteRequests')}
            >
              Quote Requests
            </button>
            <button
              className={`profile-tabs__button ${activeTab === 'contactSubmissions' ? 'profile-tabs__button--active' : ''}`}
              onClick={() => onTabChange('contactSubmissions')}
            >
              Contact submissions
            </button>
          </>
        )}
        {/* Profile Settings tab - ALWAYS VISIBLE */}
        <button
          className={`profile-tabs__button ${activeTab === 'settings' ? 'profile-tabs__button--active' : ''}`}
          onClick={() => onTabChange('settings')}
        >
          Profile Settings
        </button>
      </div>

      {/* Content display area based on active tab */}
      <div className="profile-tabs__display-area">
        {activeTab === 'appointments' &&
          (isOwner ? (
            <ProfileAppointments
              appointments={appointments}
              isOwner={true}
              handleViewDetails={handleViewDetails}
            />
          ) : (
            <ProfileAppointments
              appointments={customerAppointments}
              isOwner={false}
              handleViewDetails={handleViewDetails}
            />
          ))}

        {activeTab === 'quoteRequests' && isOwner && (
          <ProfileQuoteRequests
            quoteRequests={quoteRequests}
            handleViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'contactSubmissions' && isOwner && (
          <ProfileContactSubmissions
            contactSubmissions={contactSubmissions}
            handleViewDetails={handleViewDetails}
          />
        )}

        {/* ProfileDetailsPanel overlays or appears when an item is selected */}
        {selectedItem && (
          <ProfileDetailsPanel
            selectedItem={selectedItem}
            selectedCollection={selectedCollection}
            handleCloseDetails={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
