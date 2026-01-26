import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTripStatus,
  setPolling,
  clearTripMessages,
} from "../../../store/tripSlice";

import RiderTripRequestCard from "../components/RiderTripRequestCard";
import RiderTripStatusCard from "../components/RiderTripStatusCard";
import RiderTripTimeline from "../components/RiderTripTimeline";
import RiderTripMapMock from "../components/RiderTripMapMock";

import "./RiderTripsPage.css";

const RiderTripsPage = () => {
  const dispatch = useDispatch();
  const { lastTripId, tripStatus, loading, error, successMsg, polling } = useSelector(
    (state) => state.trip
  );

  // ✅ Poll trip status every 3 seconds if trip exists
  useEffect(() => {
    if (!lastTripId) return;

    dispatch(setPolling(true));
    const interval = setInterval(() => {
      dispatch(fetchTripStatus(lastTripId));
    }, 3000);

    return () => {
      clearInterval(interval);
      dispatch(setPolling(false));
    };
  }, [lastTripId, dispatch]);

  // auto clear banners
  useEffect(() => {
    if (!error && !successMsg) return;
    const t = setTimeout(() => dispatch(clearTripMessages()), 2500);
    return () => clearTimeout(t);
  }, [error, successMsg, dispatch]);

  return (
    <div className="rtp-shell">
      <header className="rtp-header">
        <div>
          <h1>Rider Console</h1>
          <p>Request rides and track live trip updates.</p>
        </div>

        <div className="rtp-status">
          <span className={`rtp-dot ${polling ? "active" : ""}`} />
          {polling ? "Live Tracking" : "Idle"}
        </div>
      </header>

      {(error || successMsg) && (
        <div className={`rtp-banner ${error ? "error" : "success"}`}>
          {String(error || successMsg)}
        </div>
      )}

      <div className="rtp-grid">
        <RiderTripRequestCard />

        <div className="rtp-right-stack">
          <RiderTripMapMock tripStatus={tripStatus} />
          <RiderTripStatusCard tripStatus={tripStatus} loading={loading} />
          <RiderTripTimeline tripStatus={tripStatus} />
        </div>
      </div>
    </div>
  );
};

export default RiderTripsPage;
