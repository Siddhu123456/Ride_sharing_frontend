import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverDocStatus,
  fetchCurrentShift,
} from "../../../store/driverSlice";

import DriverDocuments from "./DriverDocuments";
import DriverShift from "./DriverShift";
import DriverOffers from "./DriverOffers";
import LoadingScreen from "../components/LoadingScreen";
import DriverTrip from "./DriverTrip";

import "./DriverDashboard.css";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { docStatus, shift, loading, error } = useSelector((s) => s.driver);
  const user = useSelector((s) => s.auth.user);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { activeTrip } = useSelector((s) => s.driver);

  useEffect(() => {
    const initializeDriver = async () => {
      if (user?.user_id) {
        try {
          // Always fetch document status first
          await dispatch(fetchDriverDocStatus()).unwrap();
          
          // Try to fetch current shift (might return 404 if no shift exists)
          try {
            await dispatch(fetchCurrentShift(user.user_id)).unwrap();
          } catch (shiftError) {
            // 404 is expected when driver hasn't started shift - not an error
            if (shiftError?.status !== 404) {
              console.error("Error fetching shift:", shiftError);
            }
          }
        } catch (error) {
          console.error("Error initializing driver:", error);
        } finally {
          setInitialLoadComplete(true);
        }
      }
    };

    initializeDriver();
  }, [dispatch, user?.user_id]);

  // Show loading only during initial load
  if (!initialLoadComplete) {
    return <LoadingScreen />;
  }

  // Critical error (not 404)
  if (error && error !== "No active shift") {
    return (
      <div className="driver-dashboard">
        <div className="error-state">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  // STEP 1: Check if documents are uploaded
  if (!docStatus || !docStatus.all_uploaded) {
    return <DriverDocuments />;
  }

  // STEP 2: Check if documents are approved
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

    // 🚨 STEP 0: If driver has an active trip, show trip flow
  if (activeTrip) {
    return <DriverTrip trip={activeTrip} />;
  }


  // STEP 3: Check if driver has started shift (is ONLINE)
  // If shift is null or status is OFFLINE, show DriverShift to go online
  if (!shift || shift.status === "OFFLINE") {
    return <DriverShift />;
  }

  // STEP 4: Driver is ONLINE - show offers
  return (
    <div className="driver-dashboard">
      <DriverOffers />
    </div>
  );
};

export default DriverDashboard;