import React, { useMemo, useState } from "react";
import "./DocUploadModule.css";

const DocUploadModule = ({
  fleetId,
  docStatus,
  dispatch,
  uploadAction,
  approvalStatus,
  statusClass,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docNumber, setDocNumber] = useState("");
  const [file, setFile] = useState(null);

  const documents = useMemo(() => [
    { type: "AADHAAR", title: "Aadhaar Card", sub: "National Identity", icon: "🪪" },
    { type: "PAN", title: "PAN Card", sub: "Tax Identification", icon: "💳" },
    { type: "GST_CERTIFICATE", title: "GST Certificate", sub: "Business Tax Reg.", icon: "📄" },
    { type: "BUSINESS_REGISTRATION", title: "Business Registration", sub: "Ownership Proof", icon: "🏢" },
  ], []);

  const uploadedMap = useMemo(() => {
    const map = {};
    (docStatus?.uploaded || []).forEach(d => map[d.document_type] = d);
    return map;
  }, [docStatus]);

  const progress = Math.round(((docStatus?.uploaded?.length || 0) / documents.length) * 100);

  const handleUpload = async () => {
    if (!file) return;
    await dispatch(uploadAction({ fleetId, document_type: selectedDoc.type, document_number: docNumber, file })).unwrap();
    setShowModal(false);
    setFile(null);
    setDocNumber("");
  };

  return (
    <div className="p-module-wrapper">
      {/* 1. HEADER */}
      <div className="p-module-header">
        <div className="p-header-left">
          <h2>Document Verification</h2>
          <p>Submit business credentials to verify your fleet operations.</p>
        </div>
        <div className="p-status-container">
          <span className="p-status-label">Profile Status</span>
          <div className={`p-status-badge ${statusClass}`}>
            <span className="p-dot"></span> {approvalStatus}
          </div>
        </div>
      </div>

      {/* 2. PROGRESS */}
      <div className="p-progress-section">
        <div className="p-progress-labels">
          <span>Verification Completion</span>
          <span>{progress}%</span>
        </div>
        <div className="p-progress-track">
          <div className="p-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* 3. GRID */}
      <div className="p-docs-grid">
        {documents.map((doc) => {
          const isDone = !!uploadedMap[doc.type];
          return (
            <div key={doc.type} className={`p-doc-card ${isDone ? 'is-done' : ''}`}>
              <div className="p-card-main">
                <div className="p-card-icon">{doc.icon}</div>
                <div className="p-card-info">
                  <h4>{doc.title}</h4>
                  <p>{doc.sub}</p>
                </div>
              </div>
              <div className="p-card-footer">
                {isDone ? (
                  <span className="p-done-tag">✓ Uploaded</span>
                ) : (
                  <button className="p-upload-btn" onClick={() => { setSelectedDoc(doc); setShowModal(true); }}>
                    Upload File
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <h3>Upload {selectedDoc.title}</h3>
            <div className="p-field">
              <label>Document Number</label>
              <input type="text" placeholder="e.g. ABC12345" value={docNumber} onChange={e => setDocNumber(e.target.value)} />
            </div>
            <div className="p-field">
              <label>Attachment</label>
              <div className="p-file-input">
                <input type="file" onChange={e => setFile(e.target.files[0])} />
                <p>{file ? file.name : "Select a PDF or Image"}</p>
              </div>
            </div>
            <div className="p-modal-actions">
              <button className="p-btn-sec" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="p-btn-pri" onClick={handleUpload}>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocUploadModule;