// pages/ProfileContactSubmissions.jsx
import { useState } from 'react';
import './ProfileStyles.css';

const ITEMS_PER_PAGE = 5;

const ProfileContactSubmissions = ({ contactSubmissions, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedContactSubmissions = showAll
    ? contactSubmissions
    : contactSubmissions.slice(0, ITEMS_PER_PAGE);

  return (
    <>
      <h3 className="Profile-Contact-subtitle">All Contact Submissions</h3>
      {contactSubmissions.length === 0 ? (
        <p className="Profile-Contact-message">
          No contact submissions found matching your search.
        </p>
      ) : (
        <>
          <ul className="Profile-Contact-list Profile-Contact-dividedList">
            {displayedContactSubmissions.map((contact) => (
              <li
                key={contact.id}
                className="Profile-Contact-listItem Profile-Contact-dividedListItem Profile-Contact-clickableItem"
                onClick={() => handleViewDetails(contact, 'contactSubmissions')}
              >
                <p className="Profile-contactTitle">Contact from {contact.name}</p>
                <p className="Profile-contactDetail">
                  Email: {contact.email}, Phone: {contact.phone}
                </p>
                <p className="Profile-contactDetail Profile-Contact-smallText">
                  Message: {contact.message}
                </p>
              </li>
            ))}
          </ul>
          {contactSubmissions.length > ITEMS_PER_PAGE && (
            <div className="Profile-showMore-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="Profile-button Profile-showMoreBtn"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileContactSubmissions;