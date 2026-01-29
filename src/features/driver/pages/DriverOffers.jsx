import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffers, respondOffer } from "../../../store/driverSlice";
import OfferCard from "../components/OfferCard";
import LoadingScreen from "../components/LoadingScreen";
import "./DriverOffers.css";

const DriverOffers = () => {
  const dispatch = useDispatch();
  const { offers, loading, shift } = useSelector((s) => s.driver);
  const [respondingTo, setRespondingTo] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Only poll if driver is ONLINE
    if (shift?.status === "ONLINE") {
      // Initial fetch
      const fetchInitialOffers = async () => {
        try {
          await dispatch(fetchOffers()).unwrap();
        } catch (error) {
          console.error("Error fetching offers:", error);
        } finally {
          setInitialLoad(false);
        }
      };

      fetchInitialOffers();
      
      // Poll for new offers every 5 seconds
      const interval = setInterval(() => {
        dispatch(fetchOffers());
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setInitialLoad(false);
    }
  }, [dispatch, shift?.status]);

  const handleAccept = async (attemptId) => {
    setRespondingTo(attemptId);
    try {
      await dispatch(respondOffer({ attemptId, accept: true })).unwrap();
      // Refresh offers after accepting
      await dispatch(fetchOffers()).unwrap();
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert(error?.message || "Failed to accept offer. Please try again.");
    } finally {
      setRespondingTo(null);
    }
  };

  const handleReject = async (attemptId) => {
    setRespondingTo(attemptId);
    try {
      await dispatch(respondOffer({ attemptId, accept: false })).unwrap();
      // Refresh offers after rejecting
      await dispatch(fetchOffers()).unwrap();
    } catch (error) {
      console.error("Error rejecting offer:", error);
      alert(error?.message || "Failed to reject offer. Please try again.");
    } finally {
      setRespondingTo(null);
    }
  };

  // Show loading only on initial load
  if (initialLoad && loading) {
    return <LoadingScreen message="Loading trip offers..." />;
  }

  return (
    <div className="driver-offers">
      {/* Header Bar */}
      <div className="offers-header">
        <div className="status-indicator">
          <span className="status-dot online"></span>
          <span className="status-text">Online & Ready</span>
        </div>
        <div className="offers-count">
          {offers.length > 0 && (
            <span className="count-badge">{offers.length}</span>
          )}
        </div>
      </div>

      {/* Offers Container */}
      <div className="offers-container">
        {offers.length === 0 ? (
          <div className="offers-empty">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3>Scanning for Riders</h3>
            <p>We're actively searching for trip requests in your area.</p>
            <div className="scanning-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div className="offers-list">
            {offers.map((offer) => (
              <OfferCard
                key={offer.attempt_id}
                offer={offer}
                onAccept={() => handleAccept(offer.attempt_id)}
                onReject={() => handleReject(offer.attempt_id)}
                isResponding={respondingTo === offer.attempt_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverOffers;