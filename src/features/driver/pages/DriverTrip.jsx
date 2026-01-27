import React from "react";
import TripOtpCard from "../components/TripOtpCard";
import TripSummaryCard from "../components/TripSummaryCard";
import "./DriverTrip.css";

const DriverTrip = ({ trip }) => {
  return (
    <div className="driver-trip">
      <TripSummaryCard trip={trip} />
      <TripOtpCard tripId={trip.trip_id} />
    </div>
  );
};

export default DriverTrip;
