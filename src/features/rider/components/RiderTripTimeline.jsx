import React from "react";
import "./RiderTripTimeline.css";

const formatTime = (t) => {
  if (!t) return "—";
  return new Date(t).toLocaleString();
};

const RiderTripTimeline = ({ tripStatus }) => {
  return (
    <div className="rtl-card">
      <h3>Trip Timeline</h3>

      {!tripStatus && <p className="rtl-empty">No trip status available yet.</p>}

      {tripStatus && (
        <div className="rtl-list">
          <div className="rtl-item">
            <span className="rtl-dot" />
            <div>
              <strong>Requested</strong>
              <p>{formatTime(tripStatus.requested_at)}</p>
            </div>
          </div>

          <div className="rtl-item">
            <span className="rtl-dot" />
            <div>
              <strong>Assigned</strong>
              <p>{formatTime(tripStatus.assigned_at)}</p>
            </div>
          </div>

          <div className="rtl-item">
            <span className="rtl-dot" />
            <div>
              <strong>Picked Up</strong>
              <p>{formatTime(tripStatus.picked_up_at)}</p>
            </div>
          </div>

          <div className="rtl-item">
            <span className="rtl-dot" />
            <div>
              <strong>Completed</strong>
              <p>{formatTime(tripStatus.completed_at)}</p>
            </div>
          </div>

          <div className="rtl-item">
            <span className="rtl-dot danger" />
            <div>
              <strong>Cancelled</strong>
              <p>{formatTime(tripStatus.cancelled_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderTripTimeline;
