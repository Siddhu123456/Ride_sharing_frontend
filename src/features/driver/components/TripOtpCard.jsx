import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { generateOtp, verifyOtp } from "../../../store/driverSlice";
import "./TripOtpCard.css";

const TripOtpCard = ({ tripId }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateOtp = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await dispatch(generateOtp(tripId)).unwrap();
      setGeneratedOtp(result.otp_code);
    } catch (err) {
      setError("Failed to generate OTP. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await dispatch(verifyOtp({ tripId, otp_code: otp })).unwrap();
      // Success - trip will update to IN_PROGRESS
    } catch (err) {
      setError("Invalid OTP. Please check and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOtp(value);
    setError(null);
  };

  return (
    <div className="otp-card">
      {/* Header */}
      <div className="otp-header">
        <h3>Start Trip Verification</h3>
        <p>Generate and verify OTP with the rider to begin the trip</p>
      </div>

      {/* OTP Display */}
      {generatedOtp && (
        <div className="otp-display">
          <span className="otp-label">Share this OTP with rider:</span>
          <div className="otp-code">{generatedOtp}</div>
        </div>
      )}

      {/* Generate Button */}
      {!generatedOtp && (
        <button
          className="otp-generate-btn"
          onClick={handleGenerateOtp}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="btn-spinner-small"></span>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Generate OTP</span>
            </>
          )}
        </button>
      )}

      {/* Verification Section */}
      {generatedOtp && (
        <div className="otp-verify-section">
          <div className="otp-input-group">
            <label htmlFor="otp-input">Enter OTP from rider:</label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              placeholder="••••"
              value={otp}
              onChange={handleOtpChange}
              maxLength={4}
              className="otp-input"
            />
          </div>

          <button
            className="otp-verify-btn"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.length !== 4}
          >
            {isVerifying ? (
              <>
                <span className="btn-spinner-small"></span>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Start Trip</span>
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="otp-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="otp-instructions">
        <h4>How it works:</h4>
        <ol>
          <li>Generate a 4-digit OTP code</li>
          <li>Share the OTP with your rider</li>
          <li>Ask rider to confirm the OTP</li>
          <li>Enter the confirmed OTP to start the trip</li>
        </ol>
      </div>
    </div>
  );
};

export default TripOtpCard;