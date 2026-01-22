import { Routes, Route, Navigate } from "react-router-dom";
import Register from './features/auth/Register.jsx';
import Login from './features/auth/Login.jsx';

// Admin Imports
import AdminLayout from './features/admin/AdminLayout.jsx';
import AdminLogin from './features/admin/AdminLogin.jsx'; // Import the new page
import TenantManager from './features/admin/TenantManager.jsx';
import FleetRegistration from './features/fleet/FleetRegistration.jsx';
import VehicleOnboarding from './features/fleet/VehicleOnboarding.jsx';

// ...




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        
        {/* User Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="tenants" replace />} />
           <Route path="tenants" element={<TenantManager />} />
        </Route>

        <Route path="/fleet-registration" element={<FleetRegistration />} />
        <Route path="/fleet/add-vehicle" element={<VehicleOnboarding />} />
        
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </>
  );
}

export default App;