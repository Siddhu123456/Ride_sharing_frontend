import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { generateOtp, verifyOtp } from "../../../store/driverSlice";
import "./TripOtpCard.css"

const TripOtpCard = ({ tripId }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  return (
    <div className="otp-card">
      <button onClick={() => dispatch(generateOtp(tripId))}>
        Generate OTP
      </button>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />

      <button onClick={() => dispatch(verifyOtp({ tripId, otp_code: otp }))}>
        Start Trip
      </button>
    </div>
  );
};

export default TripOtpCard;
