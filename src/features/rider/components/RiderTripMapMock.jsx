import React from "react";
import "./RiderTripMapMock.css";

const RiderTripMapMock = ({ tripStatus }) => {
  return (
    <div className="rmap-card">
      <div className="rmap-top">
        <h3>Route Preview</h3>
        <span className="rmap-badge">
          {tripStatus?.status ? `Status: ${tripStatus.status}` : "No Trip"}
        </span>
      </div>

      <div className="rmap-box">
        <div className="rmap-pin pickup">📍 Pickup</div>
        <div className="rmap-line"></div>
        <div className="rmap-pin drop">🏁 Drop</div>
      </div>

      <p className="rmap-note">
        (Mock map UI) Replace this with Google Maps / Mapbox later.
      </p>
    </div>
  );
};

export default RiderTripMapMock;
