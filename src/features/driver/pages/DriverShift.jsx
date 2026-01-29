import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startShift, endShift, updateLocation } from "../../../store/driverSlice";
import "./DriverShift.css";

const DriverShift = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { shift, loading } = useSelector((state) => state.driver);
  
  const [locationError, setLocationError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get current location on mount and every 30 seconds when online
  useEffect(() => {
    if (navigator.geolocation) {
      // Initial location fetch
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Location access required to manage shift");
        }
      );

      // Update location every 30 seconds if online
      let locationInterval;
      if (shift?.status === "ONLINE") {
        locationInterval = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData = {
                driver_id: user.user_id,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              
              // Send location update to backend
              dispatch(updateLocation(locationData));
            },
            (error) => {
              console.error("Location update error:", error);
            }
          );
        }, 30000); // 30 seconds
      }

      return () => {
        if (locationInterval) {
          clearInterval(locationInterval);
        }
      };
    } else {
      setLocationError("Geolocation not supported by your browser");
    }
  }, [shift?.status, dispatch, user?.user_id]);

  const goOnline = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setIsProcessing(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await dispatch(
            startShift({
              driver_id: user.user_id,
              tenant_id: user.tenant_id || 1, // Use user's tenant_id
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            })
          ).unwrap();
        } catch (error) {
          setLocationError(error || "Failed to start shift. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      },
      (error) => {
        setLocationError("Unable to access your location. Please enable location services.");
        setIsProcessing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const goOffline = async () => {
    setIsProcessing(true);
    try {
      await dispatch(endShift({ driver_id: user.user_id })).unwrap();
    } catch (error) {
      setLocationError(error || "Failed to end shift. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isOnline = shift?.status === "ONLINE";
  const buttonDisabled = loading || isProcessing || (!currentLocation && !isOnline);

  return (
    <div className="driver-shift">
      <div className="shift-container">
        {/* Header */}
        <div className="shift-header">
          <h1>Shift Status</h1>
          <p>Manage your availability to receive trip requests</p>
        </div>

        {/* Status Card */}
        <div className={`shift-status-card ${isOnline ? "online" : "offline"}`}>
          <div className="status-indicator-large">
            <div className={`status-circle ${isOnline ? "online" : "offline"}`}>
              {isOnline ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M20 6L9 17L4 12" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              )}
            </div>
          </div>

          <div className="status-details">
            <h2>{isOnline ? "You're Online" : "You're Offline"}</h2>
            <p>
              {isOnline
                ? "You're currently receiving trip requests"
                : "Go online to start receiving trip requests"}
            </p>
          </div>
        </div>

        {/* Location Status */}
        {!isOnline && currentLocation && (
          <div className="location-status success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>Location enabled</span>
          </div>
        )}

        {locationError && (
          <div className="location-status error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <span>{locationError}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`shift-toggle-btn ${isOnline ? "offline-btn" : "online-btn"}`}
          onClick={isOnline ? goOffline : goOnline}
          disabled={buttonDisabled}
        >
          {isProcessing ? (
            <span className="btn-spinner"></span>
          ) : (
            <span>{isOnline ? "Go Offline" : "Go Online"}</span>
          )}
        </button>

        {/* Info Section */}
        <div className="shift-info">
          <h4>How it works</h4>
          <ul>
            <li>Toggle online to start receiving trip requests</li>
            <li>Accept trips that work for your schedule</li>
            <li>Location is tracked while online for trip matching</li>
            <li>Go offline anytime to stop receiving requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DriverShift; 