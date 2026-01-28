import React from "react";
import TripSummaryCard from "../components/TripSummaryCard";
import TripOtpCard from "../components/TripOtpCard";
import TripNavigation from "../components/TripNavigation";
import "./DriverTrip.css";

const DriverTrip = ({ trip }) => {
  return (
    <div className="driver-trip">
      {/* Header */}
      <div className="trip-header">
        <div className="trip-status-badge">
          <span className="status-dot active"></span>
          <span className="status-text">Active Trip</span>
        </div>
        <div className="trip-id">Trip #{trip.trip_id}</div>
      </div>

      {/* Main Content */}
      <div className="trip-content">
        <TripSummaryCard trip={trip} />
        
        {trip.status === "ACCEPTED" && <TripOtpCard tripId={trip.trip_id} />}
        
        {trip.status === "IN_PROGRESS" && <TripNavigation trip={trip} />}
      </div>
    </div>
  );
};

export default DriverTrip;