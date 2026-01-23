import React from 'react';

const DashboardOverview = ({ navigate, setShowAddVehicleModal }) => {
  return (
    <div className="fd-overview-container">
      {/* Stats Grid ... (keep existing) */}
      <div className="fd-stats-grid">
         {/* ... */}
      </div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="fd-actions-grid">
        {/* ✅ Update OnClick */}
        <button className="action-card" onClick={() => setShowAddVehicleModal(true)}>
          <span className="icon">+</span>
          <span>Add New Vehicle</span>
        </button>
        <button className="action-card" onClick={() => alert('Coming Soon')}>
          <span className="icon">👤</span>
          <span>Onboard Driver</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;