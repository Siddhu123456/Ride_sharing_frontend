import React from "react";
import "./TripSummaryCard.css";

const TripSummaryCard = ({ trip }) => (
  <div className="trip-summary">
    <div><strong>Trip ID:</strong> {trip.trip_id}</div>
    <div><strong>Status:</strong> {trip.status}</div>
  </div>
);

export default TripSummaryCard;
