import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./TripNavigation.css";

const TripNavigation = ({ trip }) => {
  const dispatch = useDispatch();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteTrip = async () => {
    setIsCompleting(true);
    // Add your complete trip action here
    // await dispatch(completeTrip(trip.trip_id));
  };

  const handleEmergency = () => {
    // Emergency action
    alert("Emergency services contacted");
  };

  return (
    <div className="trip-navigation">
      {/* Navigation Header */}
      <div className="nav-header">
        <h3>Navigate to Destination</h3>
        <div className="nav-eta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>ETA: {trip.estimated_time || "10 min"}</span>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="map-container">
        <div className="map-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p>Map integration goes here</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="nav-actions">
        <button className="action-btn secondary" onClick={handleEmergency}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          <span>Emergency</span>
        </button>

        <button className="action-btn secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Call Rider</span>
        </button>
      </div>

      {/* Complete Trip Button */}
      <button
        className="complete-trip-btn"
        onClick={handleCompleteTrip}
        disabled={isCompleting}
      >
        {isCompleting ? (
          <>
            <span className="btn-spinner-small"></span>
            <span>Completing...</span>
          </>
        ) : (
          <span>Complete Trip</span>
        )}
      </button>
    </div>
  );
};

export default TripNavigation;