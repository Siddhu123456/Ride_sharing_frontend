import React from "react";
import "./TripSummaryCard.css";

const TripSummaryCard = ({ trip }) => {
  const statusConfig = {
    ACCEPTED: { label: "Trip Accepted", color: "#3b82f6" },
    IN_PROGRESS: { label: "In Progress", color: "#22c55e" },
    COMPLETED: { label: "Completed", color: "#6b7280" },
    CANCELLED: { label: "Cancelled", color: "#ef4444" },
  };

  const currentStatus = statusConfig[trip.status] || statusConfig.ACCEPTED;

  return (
    <div className="trip-summary">
      {/* Status Banner */}
      <div
        className="status-banner"
        style={{ backgroundColor: `${currentStatus.color}15` }}
      >
        <div
          className="status-indicator"
          style={{ backgroundColor: currentStatus.color }}
        ></div>
        <span style={{ color: currentStatus.color }}>{currentStatus.label}</span>
      </div>

      {/* Trip Information */}
      <div className="trip-info-grid">
        {/* Locations */}
        <div className="info-section full-width">
          <div className="location-flow">
            <div className="location-point">
              <div className="point-icon pickup">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
              <div className="point-details">
                <span className="point-label">Pickup</span>
                <span className="point-address">
                  {trip.pickup_address || "Loading..."}
                </span>
              </div>
            </div>

            <div className="flow-line"></div>

            <div className="location-point">
              <div className="point-icon dropoff">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="point-details">
                <span className="point-label">Dropoff</span>
                <span className="point-address">
                  {trip.dropoff_address || "Loading..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="info-item">
          <span className="info-label">Distance</span>
          <span className="info-value">{trip.distance || "0 km"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Duration</span>
          <span className="info-value">{trip.estimated_time || "0 min"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Fare</span>
          <span className="info-value highlight">
            {trip.fare || "₹0"}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Rider Rating</span>
          <span className="info-value">
            ⭐ {trip.rider_rating || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripSummaryCard;