import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addVehicle, uploadVehicleDoc, fetchVehicleDocStatus, 
  resetVehicleState, clearMessages 
} from '../../../store/vehicleSlice';
// Reusing styles from Fleet.css/VehicleOnboarding.css but scoped to modal
import '../Fleet.css'; 

const VEHICLE_DOCS = [
  { key: 'REGISTRATION_CERTIFICATE', label: 'RC Book' },
  { key: 'INSURANCE_POLICY', label: 'Insurance Policy' },
  { key: 'VEHICLE_PERMIT', label: 'Vehicle Permit' },
  { key: 'POLLUTION_CERT', label: 'Pollution Certificate' }
];

const VEHICLE_CATEGORIES = ['SEDAN', 'SUV', 'HATCHBACK', 'LUXURY'];

const AddVehicleModal = ({ fleetId, onClose }) => {
  const dispatch = useDispatch();
  
  const { currentVehicle, docStatus, loading, error, successMsg, step } = useSelector((state) => state.vehicle);

  // Form State
  const [vehicleForm, setVehicleForm] = useState({
    registration_no: '', category: 'SEDAN', make: '', model: '', year_of_manufacture: new Date().getFullYear()
  });

  // Upload State
  const [activeDoc, setActiveDoc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    dispatch(resetVehicleState());
  }, [dispatch]);

  // Poll status in Step 2
  useEffect(() => {
    if (step === 2 && currentVehicle) {
      dispatch(fetchVehicleDocStatus(currentVehicle.vehicle_id));
    }
  }, [step, currentVehicle, dispatch]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    dispatch(addVehicle({ fleetId, vehicleData: vehicleForm }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    await dispatch(uploadVehicleDoc({
      vehicleId: currentVehicle.vehicle_id,
      docData: { document_type: activeDoc, file: selectedFile }
    }));
    setActiveDoc(null);
    setSelectedFile(null);
  };

  const isUploaded = (key) => docStatus.uploaded.some(d => d.document_type === key);

  return (
    <div className="modal-overlay">
      <div className="modal-box large"> {/* 'large' class for wider vehicle form */}
        
        <div className="modal-header">
          <h3>{step === 1 ? 'Add New Vehicle' : 'Vehicle Documentation'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Alerts */}
          {(error || successMsg) && (
            <div className={`auth-alert ${error ? 'error' : 'success'}`} style={{marginBottom: '20px'}}>
              {error || successMsg}
            </div>
          )}

          {/* --- STEP 1: DETAILS --- */}
          {step === 1 && (
            <form onSubmit={handleAddSubmit} className="registration-form">
              <div className="form-row">
                <label>Registration Number</label>
                <input 
                  type="text" placeholder="MH02AB1234" required 
                  value={vehicleForm.registration_no} 
                  onChange={(e) => setVehicleForm({...vehicleForm, registration_no: e.target.value.toUpperCase()})} 
                />
              </div>
              <div className="form-row split-flex-row">
                <div className="form-row">
                  <label>Category</label>
                  <select value={vehicleForm.category} onChange={(e) => setVehicleForm({...vehicleForm, category: e.target.value})}>
                    {VEHICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <label>Year</label>
                  <input type="number" required value={vehicleForm.year_of_manufacture} onChange={(e) => setVehicleForm({...vehicleForm, year_of_manufacture: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="form-row split-flex-row">
                <div className="form-row"><label>Make</label><input type="text" required value={vehicleForm.make} onChange={(e) => setVehicleForm({...vehicleForm, make: e.target.value})} /></div>
                <div className="form-row"><label>Model</label><input type="text" required value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})} /></div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="rydo-btn-sec" onClick={onClose}>Cancel</button>
                <button type="submit" className="rydo-btn-pri" disabled={loading}>
                  {loading ? 'Creating...' : 'Next: Upload Docs'}
                </button>
              </div>
            </form>
          )}

          {/* --- STEP 2: DOCUMENTS --- */}
          {step === 2 && (
            <div className="fleet-docs-container">
              <div className="docs-list">
                {VEHICLE_DOCS.map((doc) => {
                  const done = isUploaded(doc.key);
                  return (
                    <div key={doc.key} className={`doc-card ${done ? 'completed' : ''}`}>
                      <div className="doc-info">
                        <span className="doc-name">{doc.label}</span>
                        <span className={`doc-status ${done ? 'ok' : 'pending'}`}>{done ? '✓ Uploaded' : 'Required'}</span>
                      </div>
                      {!done && (
                        <button 
                          className="doc-action-btn" 
                          onClick={() => { setActiveDoc(doc.key); dispatch(clearMessages()); }}
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upload Sub-Modal (Nested or Inline) */}
              {activeDoc && (
                <div className="inline-upload-box">
                  <h4>Upload {VEHICLE_DOCS.find(d => d.key === activeDoc)?.label}</h4>
                  <form onSubmit={handleUploadSubmit} className="registration-form">
                    <input type="file" onChange={handleFileChange} required className="file-input-real" />
                    <div className="modal-actions">
                      <button type="button" className="rydo-btn-sec small" onClick={() => setActiveDoc(null)}>Cancel</button>
                      <button type="submit" className="rydo-btn-pri small" disabled={loading}>Confirm</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Completion Action */}
              {docStatus.all_uploaded && !activeDoc && (
                <div className="docs-complete-box">
                  <h3>Vehicle Ready</h3>
                  <p>Documents submitted for verification.</p>
                  <button className="rydo-submit-btn" onClick={onClose}>Finish & Close</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;