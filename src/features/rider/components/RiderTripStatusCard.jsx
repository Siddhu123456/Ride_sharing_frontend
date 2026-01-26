import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelTrip, fetchTripStatus } from "../../../store/tripSlice";
import "./RiderTripStatusCard.css";

const RiderTripStatusCard = ({ tripStatus, loading }) => {
  const dispatch = useDispatch();
  const { lastTripId } = useSelector((state) => state.trip);

  const canCancel =
    tripStatus &&
    !["PICKED_UP", "COMPLETED", "CANCELLED"].includes(tripStatus.status);

  const handleCancel = () => {
    if (!lastTripId) return;
    dispatch(cancelTrip({ tripId: lastTripId, payload: { reason: "Changed my mind" } }))
      .then(() => dispatch(fetchTripStatus(lastTripId)));
  };

  return (
    <div className="rstat-card">
      <div className="rstat-head">
        <h3>Live Trip Status</h3>
        <span className={`rstat-pill ${tripStatus?.status || "idle"}`}>
          {tripStatus?.status || "IDLE"}
        </span>
      </div>

      {!lastTripId && (
        <p className="rstat-empty">No active trip. Request a ride to see status.</p>
      )}

      {lastTripId && (
        <div className="rstat-body">
          <div className="rstat-row">
            <span>Trip ID</span>
            <strong>#{lastTripId}</strong>
          </div>

          <div className="rstat-row">
            <span>Driver ID</span>
            <strong>{tripStatus?.driver_id ?? "Not assigned"}</strong>
          </div>

          <div className="rstat-row">
            <span>Vehicle ID</span>
            <strong>{tripStatus?.vehicle_id ?? "Not assigned"}</strong>
          </div>

          <button
            className="rstat-btn"
            disabled={!canCancel || loading}
            onClick={handleCancel}
          >
            {loading ? "Processing..." : canCancel ? "Cancel Trip" : "Cannot Cancel"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RiderTripStatusCard;
