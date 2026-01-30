import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { setPickupLocation, setDropLocation } from '../../../store/locationSlice';
import { useGeolocation } from '../../../hooks/useGeolocation';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

/* ---------------- FIX LEAFLET ICON ISSUE ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ---------------- REVERSE GEOCODING (FREE) ---------------- */
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name || 'Unknown location';
  } catch {
    return 'Unknown location';
  }
};

/* ---------------- MAP CLICK HANDLER ---------------- */
const MapClickHandler = ({ activeMarker, onPick }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      onPick({ lat, lng, address });
    },
  });
  return null;
};

const LocationPicker = ({ onLocationsSet }) => {
  const dispatch = useDispatch();
  const { pickup, drop } = useSelector((state) => state.location);
  const { getCurrentLocation, loading: geoLoading } = useGeolocation();

  const [activeMarker, setActiveMarker] = useState('pickup');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');

  /* ---------------- MAP CLICK LOGIC ---------------- */
  const handlePick = ({ lat, lng, address }) => {
    if (activeMarker === 'pickup') {
      dispatch(setPickupLocation({ lat, lng, address }));
      setPickupAddress(address);
      setActiveMarker('drop');
    } else {
      dispatch(setDropLocation({ lat, lng, address }));
      setDropAddress(address);
    }
  };

  /* ---------------- CURRENT LOCATION ---------------- */
  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.lat, location.lng);

      dispatch(setPickupLocation({ ...location, address }));
      setPickupAddress(address);
      setActiveMarker('drop');
    } catch (err) {
      console.error('Failed to get current location', err);
    }
  };

  /* ---------------- CONTINUE ---------------- */
  const handleContinue = () => {
    if (pickup.lat && drop.lat) {
      onLocationsSet();
    }
  };

  return (
    <div className="location-picker">
      {/* HEADER */}
      <div className="location-picker-header">
        <h2>Where to?</h2>
        <p className="instruction">
          {activeMarker === 'pickup'
            ? 'Tap on map to set pickup location'
            : 'Tap on map to set drop location'}
        </p>
      </div>

      {/* INPUTS */}
      <div className="location-inputs">
        <div
          className={`location-input-group ${activeMarker === 'pickup' ? 'active' : ''}`}
          onClick={() => setActiveMarker('pickup')}
        >
          <MapPin className="icon pickup-icon" size={20} />
          <input
            type="text"
            placeholder="Pickup location"
            value={pickupAddress}
            readOnly
          />
        </div>

        <div
          className={`location-input-group ${activeMarker === 'drop' ? 'active' : ''}`}
          onClick={() => setActiveMarker('drop')}
        >
          <MapPin className="icon drop-icon" size={20} />
          <input
            type="text"
            placeholder="Drop location"
            value={dropAddress}
            readOnly
          />
        </div>
      </div>

      {/* MAP */}
      <div className="map-container">
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            activeMarker={activeMarker}
            onPick={handlePick}
          />

          {pickup.lat && (
            <Marker position={[pickup.lat, pickup.lng]} />
          )}

          {drop.lat && (
            <Marker position={[drop.lat, drop.lng]} />
          )}
        </MapContainer>

        <button
          className="current-location-btn"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
        >
          <Navigation size={18} />
          {geoLoading ? 'Locating...' : 'Use current location'}
        </button>
      </div>

      {/* CONTINUE */}
      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!pickup.lat || !drop.lat}
      >
        Continue
      </button>
    </div>
  );
};

export default LocationPicker;
