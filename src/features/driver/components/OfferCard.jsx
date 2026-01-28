import React, { useState, useEffect } from "react";
import "./OfferCard.css";

const OfferCard = ({ offer, onAccept, onReject, isResponding }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to respond

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    return `0:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimeClass = () => {
    if (timeLeft <= 10) return "urgent";
    if (timeLeft <= 20) return "warning";
    return "normal";
  };

  // Mock data - in production this would come from the offer object
  const tripData = {
    pickupAddress: offer.pickup_address || "123 Main Street",
    dropoffAddress: offer.dropoff_address || "456 Oak Avenue",
    distance: offer.distance || "3.2 km",
    estimatedFare: offer.estimated_fare || "₹150",
    estimatedTime: offer.estimated_time || "12 min",
    riderRating: offer.rider_rating || 4.8,
  };

  return (
    <div className="offer-card">
      {/* Timer Header */}
      <div className={`offer-timer ${getTimeClass()}`}>
        <div className="timer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="timer-text">Respond in {formatTime(timeLeft)}</span>
        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Trip Details */}
      <div className="offer-details">
        {/* Locations */}
        <div className="location-section">
          <div className="location-item pickup">
            <div className="location-dot"></div>
            <div className="location-info">
              <span className="location-label">Pickup</span>
              <span className="location-address">{tripData.pickupAddress}</span>
            </div>
          </div>

          <div className="location-connector"></div>

          <div className="location-item dropoff">
            <div className="location-dot"></div>
            <div className="location-info">
              <span className="location-label">Dropoff</span>
              <span className="location-address">{tripData.dropoffAddress}</span>
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="trip-stats">
          <div className="stat-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{tripData.distance}</span>
          </div>

          <div className="stat-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{tripData.estimatedTime}</span>
          </div>

          <div className="stat-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{tripData.riderRating}</span>
          </div>
        </div>

        {/* Fare */}
        <div className="offer-fare">
          <span className="fare-label">Estimated Earnings</span>
          <span className="fare-amount">{tripData.estimatedFare}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="offer-actions">
        <button
          className="reject-btn"
          onClick={onReject}
          disabled={isResponding}
        >
          {isResponding ? "..." : "Decline"}
        </button>
        <button
          className="accept-btn"
          onClick={onAccept}
          disabled={isResponding}
        >
          {isResponding ? (
            <span className="btn-spinner-small"></span>
          ) : (
            "Accept Trip"
          )}
        </button>
      </div>
    </div>
  );
};

export default OfferCard;