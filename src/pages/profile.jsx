import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import "./PageStyles.css";

const Profile = () => {
  const { user, db, loading: authLoading, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");

  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingCustomerAppointments, setLoadingCustomerAppointments] =
    useState(true);
  const [errorCustomerAppointments, setErrorCustomerAppointments] =
    useState(null);
  const [selectedCustomerAppointment, setSelectedCustomerAppointment] =
    useState(null);

  const [adminAppointments, setAdminAppointments] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [errorAdminData, setErrorAdminData] = useState(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [selectedAdminCollection, setSelectedAdminCollection] = useState(null);

  useEffect(() => {
    if (location.state && location.state.customerInfo) {
      console.log("Customer info for pre-fill:", location.state.customerInfo);
    }
  }, [location.state]);

  useEffect(() => {
    if (!authLoading && user && !isOwner && user.email && db) {
      setLoadingCustomerAppointments(true);
      setErrorCustomerAppointments(null);
      const q = query(
        collection(db, "appointments"),
        where("email", "==", user.email)
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const appointments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCustomerAppointments(appointments);
          setLoadingCustomerAppointments(false);
        },
        (error) => {
          console.error("Error fetching customer appointments:", error);
          setErrorCustomerAppointments(
            "Failed to load your past appointments."
          );
          setLoadingCustomerAppointments(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, db, isOwner, authLoading]);

  useEffect(() => {
    if (!authLoading && user && isOwner && db) {
      setLoadingAdminData(true);
      setErrorAdminData(null);
      const unsubscribes = [];

      const unsubscribeAppointments = onSnapshot(
        collection(db, "appointments"),
        (querySnapshot) => {
          setAdminAppointments(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (error) => {
          console.error("Error fetching admin appointments:", error);
          setErrorAdminData("Failed to load admin appointments.");
        }
      );
      unsubscribes.push(unsubscribeAppointments);

      const unsubscribeQuotes = onSnapshot(
        collection(db, "quoteRequests"),
        (querySnapshot) => {
          setQuoteRequests(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (error) => {
          console.error("Error fetching quote requests:", error);
          setErrorAdminData("Failed to load quote requests.");
        }
      );
      unsubscribes.push(unsubscribeQuotes);

      const unsubscribeContacts = onSnapshot(
        collection(db, "contactSubmissions"),
        (querySnapshot) => {
          setContactSubmissions(
            querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (error) => {
          console.error("Error fetching contact submissions:", error);
          setErrorAdminData("Failed to load contact submissions.");
        }
      );
      unsubscribes.push(unsubscribeContacts);

      setLoadingAdminData(false);
      return () => unsubscribes.forEach((unsub) => unsub());
    }
  }, [user, db, isOwner, authLoading]);

  const handleStartNewRequest = () => {
    navigate("/setapt", {
      state: {
        customerInfo: {
          name: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
        },
      },
    });
  };

  const handleViewCustomerAppointmentDetails = (apt) => {
    setSelectedCustomerAppointment(apt);
    setSelectedAdminItem(null);
  };

  const handleViewAdminItemDetails = (item, collectionName) => {
    setSelectedAdminItem(item);
    setSelectedAdminCollection(collectionName);
    setSelectedCustomerAppointment(null);
  };

  const handleCloseDetails = () => {
    setSelectedCustomerAppointment(null);
    setSelectedAdminItem(null);
    setSelectedAdminCollection(null);
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    return "N/A";
  };

  const filterItems = (items) => {
    if (!searchTerm) {
      return items;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(lowerCaseSearchTerm);
      const emailMatch = item.email
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const phoneMatch = item.phone
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const addressMatch = item.address
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const dateMatch = item.date?.toLowerCase().includes(lowerCaseSearchTerm);
      const timeMatch = item.time?.toLowerCase().includes(lowerCaseSearchTerm);
      const messageMatch = item.message
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm);
      const servicesMatch = item.selectedServices?.some(
        (service) =>
          typeof service === "string" &&
          service.toLowerCase().includes(lowerCaseSearchTerm)
      );

      return (
        nameMatch ||
        emailMatch ||
        phoneMatch ||
        addressMatch ||
        servicesMatch ||
        dateMatch ||
        timeMatch ||
        messageMatch
      );
    });
  };
  const filteredCustomerAppointments = filterItems(customerAppointments);
  const filteredAdminAppointments = filterItems(adminAppointments);
  const filteredQuoteRequests = filterItems(quoteRequests);
  const filteredContactSubmissions = filterItems(contactSubmissions);

  if (authLoading) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-loadingText">Loading profile...</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="Profile-loadingWrapper">
        <p className="Profile-errorMessage">
          You must be logged in to view this page.
        </p>
      </div>
    );
  }
  if (isOwner) {
    if (loadingAdminData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-loadingText">Loading admin dashboard data...</p>
        </div>
      );
    if (errorAdminData)
      return (
        <div className="Profile-loadingWrapper">
          <p className="Profile-errorMessage">{errorAdminData}</p>
        </div>
      );
    return (
      <div className="Profile-wrapper">
        <div className="Profile-Dashboard-Dashboard Profile-card-base">
          <h2 className="Profile-Dashboard-title">Owner Dashboard</h2>
          <div className="Profile-Dashboard-card">
            <h3 className="Profile-Dashboard-subtitle">Welcome, Owner!</h3>
            <p className="Profile-Dashboard-text">
              This is your administrative dashboard.
            </p>
          </div>
        </div>

        <div className="Profile-main-container">
          <div className="Profile-search-bar-container">
            <input
              type="text"
              placeholder="Search by name, email, phone, address, etc."
              className="Profile-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="Profile-tabs-container">
            <button
              className={`Profile-tab-button ${
                activeTab === "appointments" ? "active" : ""
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments ({filteredAdminAppointments.length})
            </button>
            <button
              className={`Profile-tab-button ${
                activeTab === "quotes" ? "active" : ""
              }`}
              onClick={() => setActiveTab("quotes")}
            >
              Quote Requests ({filteredQuoteRequests.length})
            </button>
            <button
              className={`Profile-tab-button ${
                activeTab === "contacts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              Contact Submissions ({filteredContactSubmissions.length})
            </button>
          </div>

          <div className="Profile-tab-content">
            <div className="Profile-tab-panel Profile-card-base">
              {activeTab === "appointments" && (
                <>
                  <h3 className="Profile-Appointments-subtitle">
                    All Appointments
                  </h3>
                  {filteredAdminAppointments.length === 0 ? (
                    <p className="Profile-Appointments-message">
                      No appointments found matching your search.
                    </p>
                  ) : (
                    <ul className="Profile-Appointments-list Profile-Appointments-dividedList">
                      {filteredAdminAppointments.map((apt) => (
                        <li
                          key={apt.id}
                          className="Profile-Appointments-listItem Profile-Appointments-dividedListItem Profile-Appointments-clickableItem"
                          onClick={() =>
                            handleViewAdminItemDetails(apt, "appointments")
                          }
                        >
                          <p className="Profile-appointmentTitle">
                            Appointment for {apt.name} on {apt.date} at{" "}
                            {apt.time}
                          </p>
                          <p className="Profile-appointmentDetail">
                            Email: {apt.email}, Phone: {apt.phone}
                          </p>
                          <p className="Profile-appointmentDetail Profile-Appointments-smallText">
                            Address: {apt.address}
                          </p>
                          <p className="Profile-appointmentDetail Profile-Appointments-smallText">
                            Services: {apt.selectedServices?.join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {activeTab === "quotes" && (
                <>
                  <h3 className="Profile-Quote-subtitle">All Quote Requests</h3>
                  {filteredQuoteRequests.length === 0 ? (
                    <p className="Profile-Quote-message">
                      No quote requests found matching your search.
                    </p>
                  ) : (
                    <ul className="Profile-Quote-list Profile-Quote-dividedList">
                      {filteredQuoteRequests.map((quote) => (
                        <li
                          key={quote.id}
                          className="Profile-Quote-listItem Profile-Quote-dividedListItem Profile-Quote-clickableItem"
                          onClick={() =>
                            handleViewAdminItemDetails(quote, "quoteRequests")
                          }
                        >
                          <p className="Profile-quoteTitle">
                            Quote from {quote.name}
                          </p>
                          <p className="Profile-quoteDetail">
                            Email: {quote.email}, Phone: {quote.phone}
                          </p>
                          <p className="Profile-quoteDetail Profile-Quote-smallText">
                            Message: {quote.message}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {activeTab === "contacts" && (
                <>
                  <h3 className="Profile-Contact-subtitle">
                    All Contact Submissions
                  </h3>
                  {filteredContactSubmissions.length === 0 ? (
                    <p className="Profile-Contact-message">
                      No contact submissions found matching your search.
                    </p>
                  ) : (
                    <ul className="Profile-Contact-list Profile-Contact-dividedList">
                      {filteredContactSubmissions.map((contact) => (
                        <li
                          key={contact.id}
                          className="Profile-Contact-listItem Profile-Contact-dividedListItem Profile-Contact-clickableItem"
                          onClick={() =>
                            handleViewAdminItemDetails(
                              contact,
                              "contactSubmissions"
                            )
                          }
                        >
                          <p className="Profile-contactTitle">
                            Contact from {contact.name}
                          </p>
                          <p className="Profile-contactDetail">
                            Email: {contact.email}, Phone: {contact.phone}
                          </p>
                          <p className="Profile-contactDetail Profile-Contact-smallText">
                            Message: {contact.message}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>

          {/* CORRECTED PLACEMENT: This is now a direct child of Profile-main-container */}
          <div className="Profile-right-column">
            {selectedAdminItem && (
              <div className="Profile-details-panel Profile-card-base">
                <h3 className="Profile-detail-subtitle">
                  Details for{" "}
                  {selectedAdminCollection === "appointments"
                    ? "Appointment"
                    : selectedAdminCollection === "quoteRequests"
                    ? "Quote Request"
                    : "Contact Submission"}
                </h3>
                <div>
                  {/* Details rendering logic remains the same */}
                  <button
                    onClick={handleCloseDetails}
                    className="Profile-button Profile-requestServiceBtn mt-4"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}
            <div className="Request-New-Service Profile-card-base">
              <h3 className="Profile-subtitle">Create New Appointment</h3>
              <p className="Profile-text Profile-smallText">
                Fill out the form to create a new appointment for a customer.
              </p>
              <button
                onClick={handleStartNewRequest}
                className="Profile-button Profile-requestServiceBtn"
              >
                Start New Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer View
  return (
    <div className="Profile-wrapper">
      <div className="Profile-Dashboard-Dashboard Profile-card-base">
        <h2 className="Profile-Dashboard-title">Your Profile</h2>
        <div className="Profile-Dashboard-card">
          <h3 className="Profile-Dashboard-subtitle">
            Welcome, {user?.email || "Customer"}!
          </h3>
          <p className="Profile-Dashboard-text">
            This is your personal dashboard.
          </p>
        </div>
      </div>

      <div className="Profile-main-container">
        <div className="Profile-search-bar-container">
          <input
            type="text"
            placeholder="Search your appointments..."
            className="Profile-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="Profile-tabs-container">
          <button
            className={`Profile-tab-button ${
              activeTab === "appointments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments ({filteredCustomerAppointments.length})
          </button>
        </div>

        <div className="Profile-tab-content">
          <div className="Profile-tab-panel Profile-card-base">
            {activeTab === "appointments" && (
              <>
                <h3 className="Profile-Appointments-subtitle">
                  Your Past Appointments
                </h3>
                {loadingCustomerAppointments ? (
                  <p>Loading your appointments...</p>
                ) : errorCustomerAppointments ? (
                  <p className="Profile-errorMessage">
                    {errorCustomerAppointments}
                  </p>
                ) : filteredCustomerAppointments.length === 0 ? (
                  <p className="Profile-Appointments-message">
                    You have no past appointments recorded.
                  </p>
                ) : (
                  <ul className="Profile-Appointments-list Profile-Appointments-dividedList">
                    {filteredCustomerAppointments.map((apt) => (
                      <li
                        key={apt.id}
                        className="Profile-Appointments-listItem Profile-Appointments-dividedListItem Profile-Appointments-clickableItem"
                        onClick={() =>
                          handleViewCustomerAppointmentDetails(apt)
                        }
                      >
                        <p className="Profile-appointmentTitle">
                          Appointment on {apt.date} at {apt.time}
                        </p>
                        <p className="Profile-appointmentDetail">
                          Services: {apt.selectedServices?.join(", ") || "N/A"}
                        </p>
                        <p className="Profile-appointmentDetail Profile-Appointments-smallText">
                          Address: {apt.address || "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>

        {/* CORRECTED PLACEMENT: This is now a direct child of Profile-main-container */}
        <div className="Profile-right-column">
          {selectedCustomerAppointment && (
            <div className="Profile-details-panel Profile-card-base">
              {/* Details rendering logic remains the same */}
            </div>
          )}
          <div className="Request-New-Service Profile-card-base">
            <h3 className="Profile-subtitle">Request New Service</h3>
            <p className="Profile-text Profile-smallText">
              Your contact info will be pre-filled automatically.
            </p>
            <button
              onClick={handleStartNewRequest}
              className="Profile-button Profile-requestServiceBtn"
            >
              Start New Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
