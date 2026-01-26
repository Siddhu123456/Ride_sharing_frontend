import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestTrip, setLastTripId, clearTripMessages } from "../../../store/tripSlice";
import "./RiderTripRequestCard.css";

const RiderTripRequestCard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.trip);

  const [form, setForm] = useState({
    tenant_id: 1,
    city_id: 1,
    pickup_lat: 17.385,
    pickup_lng: 78.4867,
    drop_lat: 17.4,
    drop_lng: 78.5,
    vehicle_category: "CAB",
  });

  const submit = (e) => {
    e.preventDefault();
    dispatch(clearTripMessages());

    dispatch(requestTrip(form)).then((res) => {
      if (!res.error) {
        dispatch(setLastTripId(res.payload.trip_id));
      }
    });
  };

  return (
    <div className="rreq-card">
      <h2>Request a Ride</h2>
      <p className="rreq-sub">Choose pickup & drop coordinates and vehicle type.</p>

      <form className="rreq-form" onSubmit={submit}>
        <div className="rreq-row">
          <label>Tenant ID</label>
          <input
            type="number"
            value={form.tenant_id}
            onChange={(e) => setForm({ ...form, tenant_id: Number(e.target.value) })}
          />
        </div>

        <div className="rreq-row">
          <label>City ID</label>
          <input
            type="number"
            value={form.city_id}
            onChange={(e) => setForm({ ...form, city_id: Number(e.target.value) })}
          />
        </div>

        <div className="rreq-grid2">
          <div className="rreq-row">
            <label>Pickup Lat</label>
            <input
              type="number"
              step="0.000001"
              value={form.pickup_lat}
              onChange={(e) => setForm({ ...form, pickup_lat: Number(e.target.value) })}
            />
          </div>

          <div className="rreq-row">
            <label>Pickup Lng</label>
            <input
              type="number"
              step="0.000001"
              value={form.pickup_lng}
              onChange={(e) => setForm({ ...form, pickup_lng: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="rreq-grid2">
          <div className="rreq-row">
            <label>Drop Lat</label>
            <input
              type="number"
              step="0.000001"
              value={form.drop_lat}
              onChange={(e) => setForm({ ...form, drop_lat: Number(e.target.value) })}
            />
          </div>

          <div className="rreq-row">
            <label>Drop Lng</label>
            <input
              type="number"
              step="0.000001"
              value={form.drop_lng}
              onChange={(e) => setForm({ ...form, drop_lng: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="rreq-row">
          <label>Vehicle Category</label>
          <select
            value={form.vehicle_category}
            onChange={(e) => setForm({ ...form, vehicle_category: e.target.value })}
          >
            <option value="CAB">CAB</option>
            <option value="AC-CAB">AC-CAB</option>
            <option value="AUTO">AUTO</option>
            <option value="BIKE">BIKE</option>
          </select>
        </div>

        <button className="rreq-btn" disabled={loading}>
          {loading ? "Requesting..." : "Request Trip"}
        </button>
      </form>
    </div>
  );
};

export default RiderTripRequestCard;
