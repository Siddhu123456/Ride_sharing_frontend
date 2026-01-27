import React from "react";
import "./OfferCard.css"

const OfferCard = ({ offer, onAccept, onReject }) => (
  <div className="offer-card">
    <div>Trip ID: {offer.trip_id}</div>
    <div className="offer-actions">
      <button onClick={onAccept}>Accept</button>
      <button className="danger" onClick={onReject}>
        Reject
      </button>
    </div>
  </div>
);

export default OfferCard;
