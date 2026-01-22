import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  applyForFleet, 
  checkFleetStatus, 
  fetchFleetTenants,
  fetchDocStatus,    // ✅ Import
  uploadFleetDoc     // ✅ Import
} from '../../store/fleetSlice';
import './Fleet.css';

// Define the required docs constant for mapping
const DOC_TYPES = [
  { key: 'AADHAAR', label: 'Aadhaar Card' },
  { key: 'PAN', label: 'PAN Card' },
  { key: 'GST_CERTIFICATE', label: 'GST Certificate' },
  { key: 'BUSINESS_REGISTRATION', label: 'Business Registration' }
];

const FleetRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    fleet, availableTenants, hasExistingFleet, docStatus, // ✅ Get docStatus
    loading, error, successMsg, step 
  } = useSelector((state) => state.fleet);

  // Form States
  const [formData, setFormData] = useState({ tenant_id: '', fleet_name: '' });
  
  // ✅ Upload Modal State
  const [activeDoc, setActiveDoc] = useState(null); // Which doc we are uploading
  const [docInput, setDocInput] = useState({ number: '', file_url: '' });

  // 1. Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else dispatch(checkFleetStatus());
  }, [dispatch, navigate]);

  // 2. Load Tenants if no fleet
  useEffect(() => {
    if (hasExistingFleet === false) dispatch(fetchFleetTenants());
  }, [hasExistingFleet, dispatch]);

  // 3. ✅ Load Doc Status if fleet exists
  useEffect(() => {
    if (fleet && fleet.fleet_id) {
      dispatch(fetchDocStatus(fleet.fleet_id));
    }
  }, [fleet, dispatch]);

  // --- HANDLERS ---

  const handleApply = (e) => {
    e.preventDefault();
    dispatch(applyForFleet({
      tenantId: formData.tenant_id,
      fleetName: formData.fleet_name
    }));
  };

  const handleOpenUpload = (docKey) => {
    setActiveDoc(docKey);
    // Mocking file URL for now as per requirement
    setDocInput({ number: '', file_url: `https://s3.aws.com/uploads/${docKey}_${Date.now()}.pdf` });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fleet) return;

    await dispatch(uploadFleetDoc({
      fleetId: fleet.fleet_id,
      docData: {
        document_type: activeDoc,
        document_number: docInput.number,
        file_url: docInput.file_url
      }
    }));
    setActiveDoc(null); // Close modal on success
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  // Helper to check if a specific doc type is uploaded
  const isUploaded = (key) => {
    return docStatus.uploaded.some(d => d.document_type === key);
  };

  // --- RENDER ---

  if (loading && hasExistingFleet === null) {
    return <div className="rydo-layout"><div className="form-pane">Loading...</div></div>;
  }

  return (
    <div className="rydo-layout">
      {/* Visual Pane */}
      <div className="nyc-visual-pane" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2560&auto=format&fit=crop)'}}>
        <div className="hero-content">
          <h1 className="brand-logo">Rydo<span className="brand-badge">FLEET</span></h1>
          <p className="hero-text">Scale your business. Manage your fleet.</p>
        </div>
      </div>

      {/* Form Pane */}
      <div className="form-pane">
        <div className="form-content-box wide"> {/* 'wide' class for doc cards */}
          
          <header className="form-intro">
            <h2>{step === 1 ? 'Partner Application' : 'Verification Documents'}</h2>
            <p>{step === 1 ? 'Select your operating region.' : 'Please upload the following documents.'}</p>
          </header>

          {error && <div className="auth-alert error">{error}</div>}
          {successMsg && <div className="auth-alert success">{successMsg}</div>}

          {/* --- STEP 1: APPLY --- */}
          {step === 1 && !hasExistingFleet && (
            <form onSubmit={handleApply} className="registration-form">
              <div className="form-row">
                <label>Operating City</label>
                <select 
                  value={formData.tenant_id} 
                  onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                  required
                >
                  <option value="">Select City...</option>
                  {availableTenants.length > 0 ? availableTenants.map(t => (
                    <option key={t.tenant_id} value={t.tenant_id}>{t.name} ({t.default_currency})</option>
                  )) : <option disabled>No cities available</option>}
                </select>
              </div>
              <div className="form-row">
                <label>Fleet / Business Name</label>
                <input 
                  type="text" value={formData.fleet_name} 
                  onChange={(e) => setFormData({...formData, fleet_name: e.target.value})} required 
                />
              </div>
              <button type="submit" className="rydo-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
            </form>
          )}

          {/* --- STEP 2: DOCUMENTS --- */}
          {(step === 2 || hasExistingFleet) && (
            <div className="fleet-step-2">
              
              <div className="docs-list">
                {DOC_TYPES.map((doc) => {
                  const uploaded = isUploaded(doc.key);
                  return (
                    <div key={doc.key} className={`doc-card ${uploaded ? 'completed' : ''}`}>
                      <div className="doc-info">
                        <span className="doc-name">{doc.label}</span>
                        <span className={`doc-status ${uploaded ? 'ok' : 'pending'}`}>
                          {uploaded ? '✓ Uploaded' : 'Pending'}
                        </span>
                      </div>
                      {!uploaded && (
                        <button className="doc-action-btn" onClick={() => handleOpenUpload(doc.key)}>
                          Upload
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Completion State */}
              {docStatus.all_uploaded && (
                <div className="docs-complete-box">
                  <h3>All Documents Submitted</h3>
                  <p>Your application is under review. You can now access your dashboard.</p>
                  <button className="rydo-submit-btn" onClick={handleFinish}>Go to Dashboard</button>
                </div>
              )}

              {/* --- UPLOAD MODAL --- */}
              {activeDoc && (
                <div className="modal-overlay">
                  <div className="modal-box">
                    <h3>Upload {DOC_TYPES.find(d => d.key === activeDoc)?.label}</h3>
                    
                    <form onSubmit={handleUploadSubmit} className="registration-form">
                      <div className="form-row">
                        <label>Document Number</label>
                        <input 
                          type="text" placeholder="ID Number" required
                          value={docInput.number}
                          onChange={(e) => setDocInput({...docInput, number: e.target.value})}
                        />
                      </div>
                      <div className="form-row">
                        <label>Simulated File</label>
                        <div className="fake-file-input">
                          {activeDoc}_scan.pdf
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="rydo-btn-sec" onClick={() => setActiveDoc(null)}>Cancel</button>
                        <button type="submit" className="rydo-btn-pri" disabled={loading}>
                          {loading ? 'Uploading...' : 'Confirm'}
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FleetRegistration;