import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  applyForFleet, 
  checkFleetStatus, 
  fetchFleetTenants 
} from '../../store/fleetSlice';
import './Fleet.css';

const FleetRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    availableTenants, 
    hasExistingFleet, // This becomes TRUE when registration succeeds
    loading, 
    error 
  } = useSelector((state) => state.fleet);

  const [formData, setFormData] = useState({ tenant_id: '', fleet_name: '' });

  // 1. Auth Check on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Check if user already has a fleet
      dispatch(checkFleetStatus());
    }
  }, [dispatch, navigate]);

  // 2. ✅ AUTOMATIC NAVIGATION
  // As soon as 'applyForFleet' succeeds, 'hasExistingFleet' becomes true in Redux.
  // This useEffect catches that change and moves the user to the Dashboard.
  useEffect(() => {
    if (hasExistingFleet === true) {
      navigate('/dashboard'); 
    }
  }, [hasExistingFleet, navigate]);

  // 3. Load Tenants only if user has NO fleet yet
  useEffect(() => {
    if (hasExistingFleet === false) {
      dispatch(fetchFleetTenants());
    }
  }, [hasExistingFleet, dispatch]);

  const handleApply = async (e) => {
    e.preventDefault();
    // Dispatch the API call
    await dispatch(applyForFleet({
      tenantId: formData.tenant_id,
      fleetName: formData.fleet_name
    }));
    // Note: We don't need to navigate() here manually. 
    // The Redux state change will trigger the useEffect #2 above.
  };

  // Show loader while checking /me status
  if (loading && hasExistingFleet === null) {
    return <div className="rydo-layout"><div className="form-pane">Checking Account Status...</div></div>;
  }

  return (
    <div className="rydo-layout">
      {/* Left Visual Pane */}
      <div className="nyc-visual-pane" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2560&auto=format&fit=crop)'}}>
        <div className="hero-content">
          <h1 className="brand-logo">Rydo<span className="brand-badge">FLEET</span></h1>
          <p className="hero-text">Scale your business. Manage your fleet.</p>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="form-pane">
        <div className="form-content-box">
          
          <header className="form-intro">
            <h2>Partner Application</h2>
            <p>Start your journey as a Fleet Owner.</p>
          </header>

          {error && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleApply} className="registration-form">
            <div className="form-row">
              <label>Operating City</label>
              <select 
                value={formData.tenant_id} 
                onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
                required
              >
                <option value="">Select City...</option>
                {availableTenants.length > 0 ? (
                  availableTenants.map(t => (
                    <option key={t.tenant_id} value={t.tenant_id}>
                      {t.name} ({t.default_currency})
                    </option>
                  ))
                ) : (
                  <option disabled>No cities available</option>
                )}
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
              {loading ? 'Creating Account...' : 'Submit Application'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default FleetRegistration;