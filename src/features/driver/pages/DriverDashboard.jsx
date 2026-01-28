import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverDocStatus,
  fetchCurrentShift,
} from "../../../store/driverSlice";

import DriverDocuments from "./DriverDocuments";
import DriverShift from "./DriverShift";
import DriverOffers from "./DriverOffers";
import LoadingScreen from "../components/LoadingScreen";

import "./DriverDashboard.css";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { docStatus, shift, loading } = useSelector((s) => s.driver);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchDriverDocStatus());
      dispatch(fetchCurrentShift(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  // Loading state
  if (loading && !docStatus) {
    return <LoadingScreen />;
  }

  // Document verification flow
  if (!docStatus || !docStatus.all_uploaded) {
    return <DriverDocuments />;
  }

  if (!docStatus.all_approved) {
    return (
      <div className="driver-dashboard">
        <div className="verification-pending">
          <div className="verification-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>Documents Under Review</h2>
          <p>Our team is reviewing your submitted documents. This typically takes 24-48 hours.</p>
          <p className="small-text">You'll receive a notification once approved.</p>
        </div>
      </div>
    );
  }

  // Shift management flow
  if (!shift || shift.status === "OFFLINE") {
    return <DriverShift />;
  }

  // Active driver - show offers
  return (
    <div className="driver-dashboard">
      <DriverOffers />
    </div>
  );
};

export default DriverDashboard;