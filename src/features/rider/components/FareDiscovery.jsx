import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, MapPin, ChevronRight, Loader } from 'lucide-react';
import {
  fetchFareEstimates,
  selectTenant,
  setVehicleCategory
} from '../../../store/fareSlice';
import './FareDiscovery.css';

const VEHICLE_CATEGORIES = [
  { value: 'CAB', label: 'CAB', icon: '🚗' },
  { value: 'AUTO', label: 'Auto', icon: '🛺' },
  { value: 'BIKE', label: 'Bike', icon: '🏍️' },
];

const FareDiscovery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pickup, drop } = useSelector((state) => state.location);

  const {
    estimates,
    pickupAddress,
    dropAddress,
    distanceKm,
    vehicleCategory,
    loading,
    error,
  } = useSelector((state) => state.fare);

  const [selectedCategory, setSelectedCategory] = useState(vehicleCategory);

  useEffect(() => {
    if (pickup.lat && drop.lat) {
      loadFares();
    }
  }, [pickup, drop]);

  const loadFares = () => {
    dispatch(fetchFareEstimates({
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      pickup_address: pickup.address,
      drop_lat: drop.lat,
      drop_lng: drop.lng,
      drop_address: drop.address,
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(setVehicleCategory(category));
  };

  const handleSelectTenant = (estimate) => {
    dispatch(selectTenant(estimate));
    navigate('/rider/book');
  };

  const formatFare = (fare) => `₹${fare.toFixed(2)}`;

  // 🔥 frontend filter by selected vehicle
  const filteredEstimates = estimates.filter(
    (e) => e.vehicle_category === selectedCategory
  );

  return (
    <div className="fare-discovery">
      <div className="fare-discovery-header">
        <h2>Available Rides</h2>

        <div className="route-info">
          <div className="route-item">
            <MapPin className="icon pickup-icon" size={16} />
            <span>{pickupAddress || 'Pickup location'}</span>
          </div>

          <div className="route-item">
            <MapPin className="icon drop-icon" size={16} />
            <span>{dropAddress || 'Drop location'}</span>
          </div>

          <div className="distance-info">
            <span className="distance">{distanceKm.toFixed(1)} km</span>
          </div>
        </div>
      </div>

      <div className="vehicle-categories">
        {VEHICLE_CATEGORIES.map((category) => (
          <button
            key={category.value}
            className={`category-btn ${
              selectedCategory === category.value ? 'active' : ''
            }`}
            onClick={() => handleCategoryChange(category.value)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="estimates-container">
        {loading && (
          <div className="loading-state">
            <Loader className="spinner" size={40} />
            <p>Finding best fares...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={loadFares} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredEstimates.length === 0 && (
          <div className="empty-state">
            <Car size={48} />
            <p>No {selectedCategory} rides available nearby</p>
          </div>
        )}

        {!loading && filteredEstimates.length > 0 && (
          <div className="estimates-list">
            <div className="list-header">
              <span className="sort-label">Sorted by price</span>
            </div>

            {filteredEstimates.map((estimate) => (
              <div
                key={`${estimate.tenant_id}-${estimate.vehicle_category}`}
                className="estimate-card"
                onClick={() => handleSelectTenant(estimate)}
              >
                <div className="estimate-info">
                  <div className="tenant-name">
                    {estimate.tenant_name}
                  </div>

                  <div className="estimate-details">
                    <Car className="icon" size={16} />
                    <span>{estimate.vehicle_category}</span>
                    <span className="separator">•</span>
                    <Clock className="icon" size={16} />
                    <span>
                      {estimate.available_drivers} drivers nearby
                    </span>
                  </div>
                </div>

                <div className="estimate-price">
                  <div className="fare">
                    {formatFare(estimate.fare)}
                  </div>
                  <ChevronRight className="arrow-icon" size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FareDiscovery;
