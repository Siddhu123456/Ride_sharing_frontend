import React, { useState } from 'react';

const VehicleManager = ({ navigate }) => {
  // In real app, useEffect => dispatch(fetchFleetVehicles())
  const [vehicles] = useState([]); // Empty state for now

  return (
    <div>
      <div className="module-header">
         <button className="fd-btn-primary" onClick={() => navigate('/fleet/add-vehicle')}>+ Add Vehicle</button>
      </div>

      {vehicles.length === 0 ? (
        <div className="fd-empty-state">
          <h3>No Vehicles Added</h3>
          <p>Start by adding your first vehicle to the fleet.</p>
        </div>
      ) : (
        <div className="fd-grid">
           {/* Map vehicles here */}
        </div>
      )}
    </div>
  );
};

export default VehicleManager;