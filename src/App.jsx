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

/* Driver */
import DriverDashboard from "./features/driver/pages/DriverDashboard.jsx";
import DriverDocuments from "./features/driver/pages/DriverDocuments.jsx";
import DriverShift from "./features/driver/pages/DriverShift.jsx";
import DriverOffers from "./features/driver/pages/DriverOffers.jsx";
import DriverTrip from "./features/driver/pages/DriverTrip.jsx";

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
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
      <Route path="/driver/documents" element={<DriverDocuments />} />
      <Route path="/driver/shift" element={<DriverShift />} />
      <Route path="/driver/offers" element={<DriverOffers />} />
      <Route path="/driver/trip" element={<DriverTrip />} />

       <Route path="/tenant-admin-dashboard" element={<TenantDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;
