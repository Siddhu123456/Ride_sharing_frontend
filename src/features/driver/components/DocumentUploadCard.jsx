import React, { useState, useRef } from "react";
import "./DocumentUploadCard.css";

const DocumentUploadCard = ({ type, uploaded, uploading, onUpload, status }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!type) return null;

  const label = type.replace(/_/g, " ");
  const documentTypes = {
    DRIVING_LICENSE: {
      name: "Driving License",
      icon: "license",
      description: "Front and back of your valid driver's license",
    },
    VEHICLE_REGISTRATION: {
      name: "Vehicle Registration",
      icon: "registration",
      description: "Current vehicle registration certificate",
    },
    INSURANCE: {
      name: "Insurance Certificate",
      icon: "insurance",
      description: "Valid vehicle insurance documentation",
    },
    PROFILE_PHOTO: {
      name: "Profile Photo",
      icon: "photo",
      description: "Clear photo for your driver profile",
    },
    BACKGROUND_CHECK: {
      name: "Background Check",
      icon: "check",
      description: "Background verification documents",
    },
  };

  const docInfo = documentTypes[type] || {
    name: label,
    icon: "default",
    description: "Upload required document",
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUpload(type, files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      onUpload(type, e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!uploaded && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const getStatusClass = () => {
    if (uploaded) return status === "APPROVED" ? "approved" : "pending";
    return uploading ? "uploading" : "empty";
  };

  return (
    <div
      className={`doc-card ${getStatusClass()} ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="doc-icon">
        {uploaded ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="doc-content">
        <h4 className="doc-title">{docInfo.name}</h4>
        <p className="doc-description">{docInfo.description}</p>

        {uploaded && (
          <div className="doc-status">
            {status === "APPROVED" ? (
              <span className="status-badge approved">Approved</span>
            ) : (
              <span className="status-badge pending">Under Review</span>
            )}
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar-small">
              <div className="progress-fill-animated"></div>
            </div>
            <span className="upload-text">Uploading...</span>
          </div>
        )}

        {!uploaded && !uploading && (
          <div className="upload-prompt">
            <span className="upload-text">Click to upload or drag & drop</span>
            <span className="upload-subtext">PDF, JPG, PNG (max 5MB)</span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      {!uploaded && !uploading && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default DocumentUploadCard;