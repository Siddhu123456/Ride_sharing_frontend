    import React, { useEffect, useState } from "react";
    import { useDispatch, useSelector } from "react-redux";

    import {
    fetchDriverDocStatus,
    uploadDriverDocument,
    } from "../../../store/driverSlice";

    import DocumentUploadCard from "../components/DocumentUploadCard";
    import LoadingScreen from "../components/LoadingScreen";
    import "./DriverDocuments.css";

    const DriverDocuments = () => {
    const dispatch = useDispatch();
    const { docStatus, loading } = useSelector((state) => state.driver);
    const [uploadProgress, setUploadProgress] = useState({});

    useEffect(() => {
        dispatch(fetchDriverDocStatus());
    }, [dispatch]);

    const handleUpload = async (type, file) => {
        setUploadProgress((prev) => ({ ...prev, [type]: true }));

        try {
        await dispatch(
            uploadDriverDocument({
            document_type: type,
            file_url: "uploaded-via-ui", // backend placeholder
            })
        ).unwrap();

        await dispatch(fetchDriverDocStatus());
        setUploadProgress((prev) => ({ ...prev, [type]: false }));
        } catch (error) {
        setUploadProgress((prev) => ({ ...prev, [type]: false }));
        console.error("Upload failed:", error);
        }
    };

    if (!docStatus && loading) {
        return <LoadingScreen />;
    }

    const totalRequired = (docStatus?.missing?.length || 0) + (docStatus?.uploaded?.length || 0);
    const uploaded = docStatus?.uploaded?.length || 0;
    const progressPercent = totalRequired > 0 ? (uploaded / totalRequired) * 100 : 0;

    return (
        <div className="driver-docs">
        <div className="docs-container">
            {/* Header */}
            <div className="docs-header">
            <div className="header-content">
                <h1>Driver Verification</h1>
                <p>Complete your profile to start earning with Rydo</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-stats">
                <span className="progress-label">Document Progress</span>
                <span className="progress-value">{uploaded} of {totalRequired}</span>
                </div>
                <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercent}%` }}
                />
                </div>
            </div>
            </div>

            {/* Missing Documents */}
            {docStatus?.missing?.length > 0 && (
            <div className="docs-section">
                <h3 className="section-title">Required Documents</h3>
                <div className="docs-grid">
                {docStatus.missing.map((type) => (
                    <DocumentUploadCard
                    key={type}
                    type={type}
                    uploaded={false}
                    uploading={uploadProgress[type]}
                    onUpload={handleUpload}
                    />
                ))}
                </div>
            </div>
            )}

            {/* Uploaded Documents */}
            {docStatus?.uploaded?.length > 0 && (
            <div className="docs-section">
                <h3 className="section-title">Uploaded Documents</h3>
                <div className="docs-grid">
                {docStatus.uploaded.map((doc) => (
                    <DocumentUploadCard
                    key={doc.document_id}
                    type={doc.document_type}
                    uploaded={true}
                    status={doc.status}
                    />
                ))}
                </div>
            </div>
            )}

            {/* Completion Message */}
            {docStatus?.all_uploaded && (
            <div className="completion-banner">
                <div className="completion-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path 
                    d="M20 6L9 17L4 12" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    />
                </svg>
                </div>
                <div className="completion-text">
                <h4>All Documents Submitted</h4>
                <p>We're reviewing your documents. You'll be notified once approved.</p>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default DriverDocuments;