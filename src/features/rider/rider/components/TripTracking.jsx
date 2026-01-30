import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, User, Phone, MapPin, Loader, X, AlertCircle } from 'lucide-react';
import { fetchTripStatus, fetchTripOtp, cancelTrip } from '../../../store/tripSlice';
import { usePolling } from '../../../hooks/usePolling';
import toast from 'react-hot-toast';
import './TripTracking.css';

const POLLING_INTERVAL = 3000; // 3 seconds
const OTP_POLLING_INTERVAL = 2000; // 2 seconds

const TripTracking = () => {
  const { tripId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    status,
    driverId,
    vehicleId,
    requestedAt,
    assignedAt,
    pickedUpAt,
    completedAt,
    cancelledAt,
    otp,
    fareAmount,
    isLoading,
    isCancelling,
  } = useSelector((state) => state.trip);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [shouldPollOtp, setShouldPollOtp] = useState(false);

  // Poll trip status
  const { stopPolling: stopStatusPolling } = usePolling(
    () => {
      if (tripId) {
        dispatch(fetchTripStatus(tripId));
      }
    },
    POLLING_INTERVAL,
    tripId && !['COMPLETED', 'CANCELLED'].includes(status)
  );

  // Poll OTP when trip is ASSIGNED
  const { stopPolling: stopOtpPolling } = usePolling(
    () => {
      if (tripId && shouldPollOtp) {
        dispatch(fetchTripOtp(tripId));
      }
    },
    OTP_POLLING_INTERVAL,
    shouldPollOtp
  );

  // Enable OTP polling when status is ASSIGNED
  useEffect(() => {
    if (status === 'ASSIGNED' && !otp) {
      setShouldPollOtp(true);
    } else if (status === 'PICKED_UP' || otp) {
      setShouldPollOtp(false);
      stopOtpPolling();
    }
  }, [status, otp]);

  // Stop polling when trip is completed or cancelled
  useEffect(() => {
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      stopStatusPolling();
      stopOtpPolling();
    }
  }, [status]);

  const handleCancelTrip = async () => {
    try {
      await dispatch(cancelTrip({ tripId, reason: cancelReason })).unwrap();
      toast.success('Trip cancelled successfully');
      setShowCancelDialog(false);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error('Failed to cancel trip');
    }
  };

  const canCancel = status === 'REQUESTED' || status === 'ASSIGNED';

  const renderStatusContent = () => {
    switch (status) {
      case 'REQUESTED':
        return (
          <div className="status-content searching">
            <div className="status-icon">
              <Loader className="spinner-large" size={64} />
            </div>
            <h2>Searching for a driver...</h2>
            <p>We're finding the best driver for you</p>
          </div>
        );

      case 'ASSIGNED':
        return (
          <div className="status-content assigned">
            <div className="status-icon success">
              <Car size={64} />
            </div>
            <h2>Driver Assigned!</h2>
            <p>Your driver is on the way</p>

            {driverId && (
              <div className="driver-card">
                <div className="driver-avatar">
                  <User size={32} />
                </div>
                <div className="driver-info">
                  <div className="driver-name">Driver #{driverId}</div>
                  {vehicleId && (
                    <div className="vehicle-info">Vehicle #{vehicleId}</div>
                  )}
                </div>
                <button className="call-btn">
                  <Phone size={20} />
                </button>
              </div>
            )}

            {otp && (
              <div className="otp-section">
                <div className="otp-label">Share this OTP with driver</div>
                <div className="otp-display">{otp}</div>
                <div className="otp-note">
                  Driver will verify this OTP before starting the trip
                </div>
              </div>
            )}

            {!otp && shouldPollOtp && (
              <div className="otp-loading">
                <Loader className="spinner" size={20} />
                <span>Waiting for OTP...</span>
              </div>
            )}
          </div>
        );

      case 'PICKED_UP':
        return (
          <div className="status-content on-trip">
            <div className="status-icon active">
              <Car size={64} />
            </div>
            <h2>Trip in Progress</h2>
            <p>You're on your way to the destination</p>

            {driverId && (
              <div className="driver-card">
                <div className="driver-avatar">
                  <User size={32} />
                </div>
                <div className="driver-info">
                  <div className="driver-name">Driver #{driverId}</div>
                  {vehicleId && (
                    <div className="vehicle-info">Vehicle #{vehicleId}</div>
                  )}
                </div>
                <button className="call-btn">
                  <Phone size={20} />
                </button>
              </div>
            )}

            <div className="trip-progress">
              <MapPin className="icon" size={20} />
              <span>Heading to destination</span>
            </div>
          </div>
        );

      case 'COMPLETED':
        return (
          <div className="status-content completed">
            <div className="status-icon success">
              <div className="checkmark">✓</div>
            </div>
            <h2>Trip Completed!</h2>
            <p>Thank you for riding with us</p>

            <div className="fare-summary">
              <div className="fare-label">Total Fare</div>
              <div className="fare-value">₹{fareAmount?.toFixed(2)}</div>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate('/')}
            >
              Book Another Ride
            </button>
          </div>
        );

      case 'CANCELLED':
        return (
          <div className="status-content cancelled">
            <div className="status-icon error">
              <X size={64} />
            </div>
            <h2>Trip Cancelled</h2>
            <p>This trip has been cancelled</p>

            <button
              className="primary-btn"
              onClick={() => navigate('/')}
            >
              Book New Ride
            </button>
          </div>
        );

      default:
        return (
          <div className="status-content loading">
            <Loader className="spinner-large" size={64} />
            <p>Loading trip details...</p>
          </div>
        );
    }
  };

  return (
    <div className="trip-tracking">
      <div className="trip-tracking-header">
        <h2>Trip #{tripId}</h2>
        {canCancel && (
          <button
            className="cancel-trip-btn"
            onClick={() => setShowCancelDialog(true)}
            disabled={isCancelling}
          >
            Cancel Trip
          </button>
        )}
      </div>

      <div className="trip-tracking-content">
        {renderStatusContent()}
      </div>

      {showCancelDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertCircle className="warning-icon" size={24} />
              <h3>Cancel Trip?</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to cancel this trip?
            </p>
            <textarea
              className="cancel-reason-input"
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <div className="modal-actions">
              <button
                className="modal-btn secondary"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
              >
                Keep Trip
              </button>
              <button
                className="modal-btn danger"
                onClick={handleCancelTrip}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader className="spinner" size={16} />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripTracking;