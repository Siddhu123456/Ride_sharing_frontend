import React from "react";
import "./ShiftStatusCard.css";

const ShiftStatusCard = ({ status }) => (
  <div className="shift-card">
    <strong>Status:</strong> {status}
  </div>
);

export default ShiftStatusCard;
