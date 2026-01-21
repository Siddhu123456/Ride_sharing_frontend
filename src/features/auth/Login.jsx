import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectRole, resetAuth } from '../../store/authslice';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // We will create this next

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, authStep, roles, user, token } = useSelector((state) => state.auth);

  const [creds, setCreds] = useState({
    email: '',
    password: ''
  });

  // Redirect if token exists (Login complete)
  useEffect(() => {
    if (token) {
      navigate('/dashboard'); // Change this to your actual dashboard route
    }
  }, [token, navigate]);

  // Clean up on unmount
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

  const handleRoleSelect = (role) => {
    if (user && user.user_id) {
      dispatch(selectRole({ user_id: user.user_id, role }));
    }
  };

  return (
    <div className="rydo-layout">
      {/* LEFT SIDE: NYC IMAGE (Reused from Register) */}
      <div className="nyc-visual-pane">
        <div className="hero-content">
          <h1 className="brand-logo">Rydo</h1>
          <p className="hero-text">Welcome back to the city that never sleeps.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="form-pane">
        <div className="form-content-box">
          
          <header className="form-intro">
            <h2>{authStep === 'CREDENTIALS' ? 'Sign In' : 'Select Profile'}</h2>
            <p>
              {authStep === 'CREDENTIALS' 
                ? 'Enter your details to proceed.' 
                : 'Choose how you want to ride today.'}
            </p>
          </header>

          {error && <div className="auth-alert error">{error}</div>}

          {/* VIEW 1: EMAIL & PASSWORD */}
          {authStep === 'CREDENTIALS' && (
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
            </form>
          )}

          {/* VIEW 2: ROLE SELECTION */}
          {authStep === 'ROLE_SELECT' && (
            <div className="role-selection-grid">
              {roles.map((role) => (
                <button 
                  key={role} 
                  className="role-card"
                  onClick={() => handleRoleSelect(role)}
                  disabled={loading}
                >
                  <span className="role-name">{role}</span>
                  <span className="role-arrow">→</span>
                </button>
              ))}
              
              <button 
                className="back-link" 
                onClick={() => dispatch(resetAuth())}
              >
                Use a different account
              </button>
            </div>
          )}

          {/* Footer Link (Only show on Credentials step) */}
          {authStep === 'CREDENTIALS' && (
            <div className="form-footer-link">
              New to Rydo? <Link to="/register">Create an account</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;