import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDriverDocStatus,
  uploadDriverDocument,
} from "../../../store/driverSlice";

import DocumentUploadCard from "../components/DocumentUploadCard";
import "./DriverDocuments.css";

const DriverDocuments = () => {
  const dispatch = useDispatch();
  const { docStatus, loading } = useSelector((state) => state.driver);

  useEffect(() => {
    dispatch(fetchDriverDocStatus());
  }, [dispatch]);

  const handleUpload = (type, file) => {
    dispatch(
      uploadDriverDocument({
        document_type: type,
        file_url: "uploaded-via-ui", // backend placeholder
      })
    ).then(() => {
      dispatch(fetchDriverDocStatus()); // ✅ refresh after upload
    });
  };

  // ✅ Loading guard
  if (!docStatus && loading) {
    return <div className="driver-docs">Loading documents…</div>;
  }

  return (
    <div className="driver-docs">
      <h2>Driver Documents</h2>

      {/* ✅ MISSING DOCUMENTS */}
      {docStatus?.missing?.length > 0 && (
        <>
          <h4>Required Documents</h4>
          {docStatus.missing.map((type) => (
            <DocumentUploadCard
              key={type}
              type={type}
              uploaded={false}
              onUpload={handleUpload}
            />
          ))}
        </>
      )}

      {/* ✅ UPLOADED DOCUMENTS */}
      {docStatus?.uploaded?.length > 0 && (
        <>
          <h4>Uploaded</h4>
          {docStatus.uploaded.map((doc) => (
            <DocumentUploadCard
              key={doc.document_id}
              type={doc.document_type}
              uploaded={true}
            />
          ))}
        </>
      )}

      {/* ✅ Fully complete */}
      {docStatus?.all_uploaded && (
        <p className="success-text">
          All required documents uploaded. Awaiting approval.
        </p>
      )}
    </div>
  );
};

export default DriverDocuments;
