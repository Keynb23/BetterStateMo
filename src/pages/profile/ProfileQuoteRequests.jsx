import { useState } from 'react';
import './ProfileStyles.css';

const ITEMS_PER_PAGE = 5;

const ProfileQuoteRequests = ({ quoteRequests, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);

  // The 'quoteRequests' prop is already filtered and sorted by the parent Profile.jsx
  const displayedQuoteRequests = showAll
    ? quoteRequests
    : quoteRequests.slice(0, ITEMS_PER_PAGE);

  return (
    <>
      <h3 className="Profile-Quote-subtitle">All Quote Requests</h3>
      {quoteRequests.length === 0 ? (
        <p className="Profile-Quote-message">
          No quote requests found matching your search.
        </p>
      ) : (
        <>
          <ul className="Profile-Quote-list Profile-Quote-dividedList">
            {displayedQuoteRequests.map((quote) => (
              <li
                key={quote.id}
                className="Profile-Quote-listItem Profile-Quote-dividedListItem Profile-Quote-clickableItem"
                onClick={() => handleViewDetails(quote, 'quoteRequests')}
              >
                <p className="Profile-quoteTitle">Quote from {quote.name}</p>
                <p className="Profile-quoteDetail">
                  Email: {quote.email}, Phone: {quote.phone}
                </p>
                <p className="Profile-quoteDetail Profile-Quote-smallText">
                  Message: {quote.message}
                </p>
              </li>
            ))}
          </ul>
          {quoteRequests.length > ITEMS_PER_PAGE && (
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

export default ProfileQuoteRequests;
