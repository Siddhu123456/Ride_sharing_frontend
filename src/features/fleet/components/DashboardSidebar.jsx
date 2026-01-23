import React from 'react';
import './DashboardSidebar.css';

const DashboardSidebar = ({ fleetName, activeTab, setActiveTab }) => {
  return (
    <aside className="d-sidebar">
      <div className="ds-brand">Rydo<span className="ds-badge">FLEET</span></div>
      
      <div className="ds-profile">
        <div className="ds-avatar">{fleetName.charAt(0)}</div>
        <div className="ds-info">
          <div className="ds-name">{fleetName}</div>
          <div className="ds-role">Owner Account</div>
        </div>
      </div>

      <nav className="ds-nav">
        <button className={`ds-link ${activeTab === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setActiveTab('OVERVIEW')}>Dashboard</button>
        <button className={`ds-link ${activeTab === 'VEHICLES' ? 'active' : ''}`} onClick={() => setActiveTab('VEHICLES')}>Vehicles</button>
        <button className={`ds-link ${activeTab === 'DRIVERS' ? 'active' : ''}`} onClick={() => setActiveTab('DRIVERS')}>Drivers</button>
        <button className={`ds-link ${activeTab === 'EARNINGS' ? 'active' : ''}`} onClick={() => setActiveTab('EARNINGS')}>Finance</button>
      </nav>

      <div className="ds-footer">
        <button className="ds-logout" onClick={() => { localStorage.clear(); window.location.href='/login'; }}>Log Out</button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;