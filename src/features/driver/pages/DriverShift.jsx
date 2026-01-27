import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startShift, endShift } from "../../../store/driverSlice";
import "./DriverShift.css";

const DriverShift = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { shift, loading } = useSelector((state) => state.driver);

  const goOnline = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      dispatch(
        startShift({
          driver_id: user.user_id,       // ✅ REQUIRED
          tenant_id: 1,     // ✅ REQUIRED
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      );
    });
  };

  const goOffline = () => {
    dispatch(endShift({ driver_id: user.user_id }));
  };

  return (
    <div className="driver-shift">
      <h2>Driver Shift</h2>

      {shift?.status === "ONLINE" ? (
        <button onClick={goOffline} disabled={loading}>
          Go Offline
        </button>
      ) : (
        <button onClick={goOnline} disabled={loading}>
          Go Online
        </button>
      )}
    </div>
  );
};

export default DriverShift;
