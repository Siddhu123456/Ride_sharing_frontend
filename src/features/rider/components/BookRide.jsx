import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, IndianRupee, Loader } from 'lucide-react';
import { requestTrip } from '../../../store/tripSlice';
import toast from 'react-hot-toast';
import './BookRide.css';

const BookRide = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { pickup, drop } = useSelector((state) => state.location);
    const { selectedTenant, cityId, pickupAddress, dropAddress, distanceKm, vehicleCategory } = useSelector((state) => state.fare);
    const { isRequestingTrip } = useSelector((state) => state.trip);

    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirmBooking = async () => {
        if (!selectedTenant) {
            toast.error('Please select a ride first');
            return;
        }

        setIsConfirming(true);

        const tripData = {
            tenant_id: selectedTenant.tenant_id,
            city_id: cityId,
            pickup_lat: pickup.lat,
            pickup_lng: pickup.lng,
            pickup_address: pickupAddress,
            drop_lat: drop.lat,
            drop_lng: drop.lng,
            drop_address: dropAddress,
            vehicle_category: vehicleCategory,
            fare_amount: selectedTenant.fare,
        };

        try {
            const result = await dispatch(requestTrip(tripData)).unwrap();
            toast.success('Ride requested successfully!');
            navigate(`/rider/trip/${result.trip_id}`);
        } catch (error) {
            toast.error('Failed to book ride. Please try again.');
            setIsConfirming(false);
        }
    };

    const formatFare = (fare) => {
        return `₹${fare.toFixed(2)}`;
    };


    if (!selectedTenant) {
        navigate('/rider/home');
    }

    return (
        <div className="book-ride">
            <div className="book-ride-header">
                <h2>Confirm Your Ride</h2>
            </div>

            <div className="booking-details">
                <div className="tenant-section">
                    <div className="tenant-card">
                        <div className="tenant-info">
                            <h3>{selectedTenant.tenant_name}</h3>
                            <div className="vehicle-info">
                                <Car size={16} />
                                <span>{vehicleCategory}</span>
                            </div>
                        </div>
                        <div className="fare-amount">
                            {formatFare(selectedTenant.fare)}
                        </div>
                    </div>
                </div>

                <div className="route-section">
                    <h4>Route Details</h4>
                    <div className="route-details">
                        <div className="route-point">
                            <div className="point-indicator pickup-point"></div>
                            <div className="point-info">
                                <div className="point-label">Pickup</div>
                                <div className="point-address">{pickupAddress}</div>
                            </div>
                        </div>

                        <div className="route-line"></div>

                        <div className="route-point">
                            <div className="point-indicator drop-point"></div>
                            <div className="point-info">
                                <div className="point-label">Drop</div>
                                <div className="point-address">{dropAddress}</div>
                            </div>
                        </div>
                    </div>

                    <div className="distance-display">
                        <span>Total Distance:</span>
                        <span className="distance-value">{distanceKm.toFixed(1)} km</span>
                    </div>
                </div>

                <div className="fare-breakup">
                    <h4>Fare Breakup</h4>
                    <div className="breakup-item">
                        <span>Base Fare</span>
                        <span>{formatFare(selectedTenant.breakup.base_fare || 0)}</span>
                    </div>
                    <div className="breakup-item">
                        <span>Distance ({distanceKm.toFixed(1)} km)</span>
                        <span>{formatFare(selectedTenant.breakup.distance_fare || 0)}</span>
                    </div>
                    {selectedTenant.breakup.surge_multiplier > 1 && (
                        <div className="breakup-item surge">
                            <span>Surge ({selectedTenant.breakup.surge_multiplier}x)</span>
                            <span>Applied</span>
                        </div>
                    )}
                    <div className="breakup-divider"></div>
                    <div className="breakup-item total">
                        <span>Total Fare</span>
                        <span>{formatFare(selectedTenant.fare)}</span>
                    </div>
                </div>
            </div>

            <div className="booking-actions">
                <button
                    className="cancel-btn"
                    onClick={() => navigate('/fare-discovery')}
                    disabled={isConfirming}
                >
                    Change Ride
                </button>
                <button
                    className="confirm-btn"
                    onClick={handleConfirmBooking}
                    disabled={isConfirming || isRequestingTrip}
                >
                    {isConfirming || isRequestingTrip ? (
                        <>
                            <Loader className="spinner" size={20} />
                            Confirming...
                        </>
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </div>

            {(isConfirming || isRequestingTrip) && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <Loader className="big-spinner" size={48} />
                        <p>Requesting your ride...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookRide;