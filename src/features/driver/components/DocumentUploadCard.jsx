import React from "react";
import "./DocumentUploadCard.css";

const DocumentUploadCard = ({ type, uploaded, onUpload }) => {
  // ✅ HARD GUARD — never crash
  if (!type) return null;

  const label = type.replace(/_/g, " ");

  return (
    <div className="doc-card">
      <div className="doc-info">
        <span className="doc-title">{label}</span>
        {uploaded && <span className="doc-done">Uploaded</span>}
      </div>

      {!uploaded && (
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              onUpload(type, e.target.files[0]);
            }
          }}
        />
      )}
    </div>
  );
};

export default DocumentUploadCard;
