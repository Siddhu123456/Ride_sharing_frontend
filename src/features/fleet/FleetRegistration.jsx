import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyForFleet, uploadFleetDoc, fetchDocStatus } from '../../store/fleetSlice';
import { fetchTenants } from '../../store/adminSlice'; // Reuse tenant fetching
import './Fleet.css';

const REQUIRED_DOCS = [
  { type: 'AADHAAR', label: 'Aadhaar Card' },
  { type: 'PAN', label: 'PAN Card' },
  { type: 'GST_CERTIFICATE', label: 'GST Certificate' },
  { type: 'BUSINESS_REGISTRATION', label: 'Business Registration' }
];

const FleetRegistration = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const { fleet, docStatus, loading, error, successMsg, step } = useSelector((state) => state.fleet);
  const { tenants } = useSelector((state) => state.admin);

  // Local State
  const [formData, setFormData] = useState({ tenant_id: '', fleet_name: '' });
  const [uploadData, setUploadData] = useState({ 
    document_type: '', 
    document_number: '', 
    file_url: 'https://example.com/mock-doc.pdf' // Mock URL for backend
  });
  const [activeDocType, setActiveDocType] = useState(null);

  useEffect(() => {
    dispatch(fetchTenants()); // Load tenants for dropdown
  }, [dispatch]);

  // Step 1: Submit Application
  const handleApply = (e) => {
    e.preventDefault();
    dispatch(applyForFleet({
      tenantId: formData.tenant_id,
      fleetName: formData.fleet_name
    }));
  };

  // Step 2: Handle Document Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fleet) return;

    await dispatch(uploadFleetDoc({
      fleetId: fleet.fleet_id,
      docData: {
        document_type: uploadData.document_type,
        document_number: uploadData.document_number,
        file_url: uploadData.file_url // In real app, upload file first, get URL
      }
    }));
    
    // Close modal/form on success
    setActiveDocType(null);
    setUploadData({ ...uploadData, document_number: '' });
  };

  const openUploadForm = (type) => {
    setUploadData({ ...uploadData, document_type: type });
    setActiveDocType(type);
  };

  // Check if a specific doc is uploaded
  const isUploaded = (type) => {
    return docStatus.uploaded.some(d => d.document_type === type);
  };

  return (
    <div className="rydo-layout">
      {/* LEFT SIDE: VISUAL */}
      <div className="nyc-visual-pane" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2560&auto=format&fit=crop)'}}>
        <div className="hero-content">
          <h1 className="brand-logo">Rydo<span className="brand-badge">FLEET</span></h1>
          <p className="hero-text">Scale your business. Manage your fleet.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORMS */}
      <div className="form-pane">
        <div className="form-content-box wide">
          
          {/* HEADER */}
          <header className="form-intro">
            <h2>{step === 1 ? 'Partner Application' : 'Verification Documents'}</h2>
            <p>{step === 1 ? 'Start your journey as a Fleet Owner.' : 'Upload required documents to activate your account.'}</p>
          </header>

          {error && <div className="auth-alert error">{error}</div>}
          {successMsg && <div className="auth-alert success">{successMsg}</div>}

          {/* --- STEP 1: APPLY FORM --- */}
          {step === 1 && (
            <form onSubmit={handleApply} className="registration-form">
              <div className="form-row">
                <label>Operating City (Tenant)</label>
                <select 
                  value={formData.tenant_id} 
                  onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                  required
                >
                  <option value="">Select City...</option>
                  {tenants.map(t => (
                    <option key={t.tenant_id} value={t.tenant_id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Fleet / Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Metro Cabs LLC" 
                  value={formData.fleet_name}
                  onChange={(e) => setFormData({...formData, fleet_name: e.target.value})}
                  required 
                />
              </div>

              <button type="submit" className="rydo-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
            </form>
          )}

          {/* --- STEP 2: DOCUMENT UPLOADS --- */}
          {step === 2 && (
            <div className="fleet-docs-container">
              
              <div className="docs-grid">
                {REQUIRED_DOCS.map((doc) => {
                  const uploaded = isUploaded(doc.type);
                  return (
                    <div key={doc.type} className={`doc-card ${uploaded ? 'done' : 'pending'}`}>
                      <div className="doc-info">
                        <span className="doc-label">{doc.label}</span>
                        <span className={`doc-status ${uploaded ? 'success' : 'warn'}`}>
                          {uploaded ? '✓ Uploaded' : 'Pending'}
                        </span>
                      </div>
                      
                      {!uploaded && (
                        <button 
                          className="doc-upload-btn"
                          onClick={() => openUploadForm(doc.type)}
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* UPLOAD MODAL / INLINE FORM */}
              {activeDocType && (
                <div className="upload-box-overlay">
                  <div className="upload-box">
                    <h3>Upload {REQUIRED_DOCS.find(d => d.type === activeDocType)?.label}</h3>
                    
                    <div className="form-row">
                      <label>Document Number</label>
                      <input 
                        type="text" 
                        placeholder="ID Number"
                        value={uploadData.document_number}
                        onChange={(e) => setUploadData({...uploadData, document_number: e.target.value})}
                      />
                    </div>
                    
                    {/* Simulated File Input */}
                    <div className="form-row">
                      <label>Document File</label>
                      <div className="file-mock-input">
                        <span>📄 mock-document.pdf</span>
                        <small>(Simulated Upload)</small>
                      </div>
                    </div>

                    <div className="upload-actions">
                      <button className="rydo-btn-secondary" onClick={() => setActiveDocType(null)}>Cancel</button>
                      <button className="rydo-btn-primary" onClick={handleUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Confirm Upload'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {docStatus.all_uploaded && (
                <div className="completion-box">
                  <h3>Application Under Review</h3>
                  <p>Our team will verify your documents shortly. You can check back later.</p>
                  <button className="rydo-submit-btn" onClick={() => window.location.href='/dashboard'}>Go to Dashboard</button>
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