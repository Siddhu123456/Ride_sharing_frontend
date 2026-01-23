import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkFleetStatus, fetchDocStatus, uploadFleetDoc } from '../../store/fleetSlice';

// Sub-Components
import DashboardSidebar from './components/DashboardSidebar';
import DashboardOverview from './components/DashboardOverview';
import VehicleManager from './components/VehicleManager';
import DocUploadModule from './components/DocUploadModule';
import AddVehicleModal from './components/AddVehicleModal';

import './FleetDashboard.css';

const FleetDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fleet, hasExistingFleet, docStatus, loading } = useSelector((state) => state.fleet);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  useEffect(() => { dispatch(checkFleetStatus()); }, [dispatch]);

  useEffect(() => {
    if (fleet?.fleet_id) dispatch(fetchDocStatus(fleet.fleet_id));
  }, [fleet, dispatch]);

  useEffect(() => {
    if (hasExistingFleet === false) navigate('/fleet-registration');
  }, [hasExistingFleet, navigate]);

  const statusLabel = useMemo(() => fleet?.approval_status || 'PENDING', [fleet]);

  if (loading || !fleet) return <div className="fd-loader"><div className="spinner"></div></div>;

  // --- STATE 1: ONBOARDING (UNVERIFIED) ---
  if (fleet.approval_status !== 'APPROVED') {
    return (
      <div className="fd-onboarding-layout">
        {/* ✅ CLEAN NAVBAR: Only Brand & Utility */}
        <nav className="fd-navbar">
          <div className="fd-navbar-brand">
            Rydo<span className="fd-brand-badge">FLEET</span>
          </div>
          <div className="fd-navbar-actions">
            <button className="fd-btn-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
              Sign Out
            </button>
          </div>
        </nav>

        {/* ✅ SPACIOUS CONTENT AREA */}
        <div className="fd-onboarding-content">
          <header className="fd-welcome-section">
            <div className="fd-welcome-badge">ONBOARDING PHASE</div>
            <h1>Welcome, {fleet.fleet_name}</h1>
            <p>Your fleet profile is currently <strong>{statusLabel}</strong>. Complete the verification below to activate your command center.</p>
          </header>

          <DocUploadModule
            fleetId={fleet.fleet_id}
            docStatus={docStatus}
            dispatch={dispatch}
            uploadAction={uploadFleetDoc}
            approvalStatus={statusLabel}
            statusClass={statusLabel.toLowerCase().includes('review') ? 'review' : 'pending'}
          />
        </div>
      </div>
    );
  }

  // --- STATE 2: ACTIVE DASHBOARD (VERIFIED) ---
  return (
    <div className="fd-layout">
      <DashboardSidebar fleetName={fleet.fleet_name} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="fd-main">
        <header className="fd-topbar">
          <div className="fd-breadcrumbs">
            <span className="fd-crumb-root">Console</span> / <span className="fd-crumb-active">{activeTab}</span>
          </div>
          <div className="fd-user-menu"><span className="fd-status-dot"></span> Active</div>
        </header>
        <div className="fd-view-container">
          {activeTab === 'OVERVIEW' && <DashboardOverview navigate={navigate} setShowAddVehicleModal={setShowAddVehicleModal} />}
          {activeTab === 'VEHICLES' && <VehicleManager />}
        </div>
      </main>
      {showAddVehicleModal && <AddVehicleModal fleetId={fleet.fleet_id} onClose={() => setShowAddVehicleModal(false)} />}
    </div>
  );
};

export default FleetDashboard;