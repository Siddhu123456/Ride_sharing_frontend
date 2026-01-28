import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./features/auth/Register.jsx";
import Login from "./features/auth/Login.jsx";

/* Admin */
import AdminLayout from "./features/admin/AdminLayout.jsx";
import AdminLogin from "./features/admin/AdminLogin.jsx";
import TenantManager from "./features/admin/TenantManager.jsx";

/* Fleet */
import FleetRegistration from "./features/fleet/FleetRegistration.jsx";
import FleetDashboard from "./features/fleet/FleetDashboard.jsx";

/* Rider */
import RiderTripsPage from "./features/rider/pages/RiderTripsPage.jsx";

/* Driver - Single Smart Dashboard handles all states */
import DriverDashboard from "./features/driver/pages/DriverDashboard.jsx";

import TenantDashboard from "./features/tenant/TenantDashboard.jsx"; 

function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Rider */}
      <Route path="/rider/trips" element={<RiderTripsPage />} />

      {/* Fleet Owner */}
      <Route path="/fleet-registration" element={<FleetRegistration />} />
      <Route path="/dashboard" element={<FleetDashboard />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="tenants" replace />} />
        <Route path="tenants" element={<TenantManager />} />
      </Route>

      {/* ================= DRIVER ================= */}
      {/* 
        DriverDashboard is a smart component that handles all driver states:
        1. Documents incomplete → Shows DriverDocuments component
        2. Documents pending approval → Shows verification pending screen
        3. Driver offline → Shows DriverShift component
        4. Driver online → Shows DriverOffers component
        5. Active trip → Shows DriverTrip component
        
        No need for separate routes - the dashboard intelligently routes based on state!
      */}
      <Route path="/driver" element={<DriverDashboard />} />
      
      {/* Legacy route redirects for backward compatibility */}
      <Route path="/driver-dashboard" element={<Navigate to="/driver" replace />} />
      <Route path="/driver/documents" element={<Navigate to="/driver" replace />} />
      <Route path="/driver/shift" element={<Navigate to="/driver" replace />} />
      <Route path="/driver/offers" element={<Navigate to="/driver" replace />} />
      <Route path="/driver/trip" element={<Navigate to="/driver" replace />} />

      <Route path="/tenant-admin-dashboard" element={<TenantDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;