import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectRole, resetAuth } from "../../store/authslice";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, authStep, roles, user, token } = useSelector(
    (state) => state.auth
  );

  const [creds, setCreds] = useState({ email: "", password: "" });

  // Clean up
  useEffect(() => {
    return () => {
      dispatch(resetAuth());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(creds));
  };

  // ✅ UPDATED: Role Selection Navigation
  const handleRoleSelect = async (role) => {
    if (user && user.user_id) {
      // 1. Call the API to get the token for the specific role
      const result = await dispatch(selectRole({ user_id: user.user_id, role }));

      if (selectRole.fulfilled.match(result)) {
        // DEBUG: Open your browser console (F12) and see what prints here
        console.log("Selected Role Value:", role); 

        // 2. Exact string matching (Case Sensitive)
        if (role === "RIDER") {
          navigate("/rider/trips");
        } 
        else if (role === "DRIVER") {
          navigate("/driver-dashboard");
        } 
        else if (role === "FLEET_OWNER") {
          navigate("/dashboard"); // This is your Fleet Owner Dashboard
        } 
        else if (role === "TENANT_ADMIN") {
          console.log("Redirecting to Tenant Admin...");
          navigate("/tenant-admin-dashboard"); // This must match App.jsx
        }
        else {
          console.warn("Unrecognized role:", role);
        }
      }
    }
  };

  // ✅ Become Fleet Owner Handler (same logic)
  const handleBecomeFleetOwner = async () => {
    if (user && user.user_id) {
      const result = await dispatch(selectRole({ user_id: user.user_id, role: "RIDER" }));

      if (selectRole.fulfilled.match(result)) {
        navigate("/fleet-registration");
      }
    }
  };

  const isFleetOwner = roles.includes("FLEET_OWNER");

  return (
    <div className="rydo-layout">
      {/* LEFT SIDE */}
      <div className="nyc-visual-pane">
        <div className="hero-content">
          <h1 className="brand-logo">Rydo</h1>
          <p className="hero-text">Welcome back to the city that never sleeps.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="form-pane">
        <div className="form-content-box">
          <header className="form-intro">
            <h2>{authStep === "CREDENTIALS" ? "Sign In" : "Select Profile"}</h2>
            <p>
              {authStep === "CREDENTIALS"
                ? "Enter your details to proceed."
                : "Choose how you want to ride today."}
            </p>
          </header>

          {error && <div className="auth-alert error">{String(error)}</div>}

          {/* VIEW 1: CREDENTIALS */}
          {authStep === "CREDENTIALS" && (
            <form onSubmit={handleLoginSubmit} className="registration-form">
              <div className="form-row">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="rydo-submit-btn" disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </button>

              <div className="form-footer-link">
                New to Rydo? <Link to="/register">Create an account</Link>
              </div>
            </form>
          )}

          {/* VIEW 2: ROLE SELECTION */}
          {authStep === "ROLE_SELECT" && (
            <div className="role-selection-grid">
              {/* Existing Roles */}
              {roles.map((role) => (
                <button
                  key={role}
                  className="role-card"
                  onClick={() => handleRoleSelect(role)}
                  disabled={loading}
                >
                  <span className="role-name">{role.replace("_", " ")}</span>
                  <span className="role-arrow">→</span>
                </button>
              ))}

              {/* ✅ Become Fleet Owner Button */}
              {!isFleetOwner && (
                <button
                  className="role-card fleet-promo"
                  onClick={handleBecomeFleetOwner}
                  disabled={loading}
                >
                  <div className="fleet-promo-content">
                    <span className="role-name">Become a Fleet Owner</span>
                    <span className="role-desc">Manage vehicles & drivers</span>
                  </div>
                  <span className="role-arrow">↗</span>
                </button>
              )}

              <button className="back-link" onClick={() => dispatch(resetAuth())}>
                Use a different account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
