import { Routes, Route, Navigate } from "react-router-dom";
import Register from './features/auth/Register.jsx';
import Login from "./features/auth/Login.jsx";
import './App.css';

function App() {
  return (
    <>
      <Routes>
        {/* Redirect root "/" to "/register" automatically */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Catch-all for 404s */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </>
  );
}

export default App;