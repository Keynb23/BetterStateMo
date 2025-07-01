// pages/ProfileAppointments.jsx
import { useState } from 'react';
import './ProfileStyles.css';

const ITEMS_PER_PAGE = 5;

const ProfileAppointments = ({ appointments, isOwner, handleViewDetails }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedAppointments = showAll
    ? appointments
    : appointments.slice(0, ITEMS_PER_PAGE);

  return (
    <>
      <h3 className="Profile-Appointments-subtitle">
        {isOwner ? 'All Appointments' : 'Your Past Appointments'}
      </h3>
      {appointments.length === 0 ? (
        <p className="Profile-Appointments-message">
          {isOwner
            ? 'No appointments found matching your search.'
            : 'You have no past appointments.'}
        </p>
      ) : (
        <>
          <ul className="Profile-Appointments-list Profile-Appointments-dividedList">
            {displayedAppointments.map((apt) => (
              <li
                key={apt.id}
                className="Profile-Appointments-listItem Profile-Appointments-dividedListItem Profile-Appointments-clickableItem"
                onClick={() => handleViewDetails(apt, 'appointments')} // Pass collection name for admin view
              >
                <p className="Profile-appointmentTitle">
                  {isOwner
                    ? `Appointment for ${apt.name} on ${apt.date} at ${apt.time}`
                    : `Appointment on ${apt.date} at ${apt.time}`}
                </p>
                {isOwner && (
                  <p className="Profile-appointmentDetail">
                    Email: {apt.email}, Phone: {apt.phone}
                  </p>
                )}
                {isOwner && (
                  <p className="Profile-appointmentDetail Profile-Appointments-smallText">
                    Address: {apt.address}
                  </p>
                )}
                <p className="Profile-appointmentDetail Profile-Appointments-smallText">
                  Services: {apt.selectedServices?.join(', ')}
                </p>
              </li>
            ))}
          </ul>
          {appointments.length > ITEMS_PER_PAGE && (
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

export default ProfileAppointments;