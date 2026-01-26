import { Routes, Route, Navigate } from "react-router-dom";
import Register from './features/auth/Register.jsx';
import Login from './features/auth/Login.jsx';
import AdminLayout from './features/admin/AdminLayout.jsx';
import AdminLogin from './features/admin/AdminLogin.jsx';
import TenantManager from './features/admin/TenantManager.jsx';
import FleetRegistration from './features/fleet/FleetRegistration.jsx';
import FleetDashboard from './features/fleet/FleetDashboard.jsx'; // ✅
import RiderTripsPage from "./features/rider/pages/RiderTripsPage.jsx";


import VehicleOnboarding from './features/fleet/VehicleOnboarding.jsx'; // ✅

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Fleet */}
      <Route path="/fleet-registration" element={<FleetRegistration />} />
      <Route path="/dashboard" element={<FleetDashboard />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<Navigate to="tenants" replace />} />
         <Route path="tenants" element={<TenantManager />} />
      </Route>

      <Route path="*" element={<Navigate to="/register" replace />} />

      <Route path="/rider/trips" element={<RiderTripsPage />} />
    </Routes>
  );
}

export default App;