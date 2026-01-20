import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, fetchCountries } from '../../store/authslice';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const { countries, loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    country_code: '', 
    password: '',
  });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // Auto-select first country code when they load
  useEffect(() => {
    if (countries.length > 0 && !formData.country_code) {
      setFormData(prev => ({ ...prev, country_code: countries[0].country_code }));
    }
  }, [countries, formData.country_code]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Registration:", formData);
    dispatch(registerUser(formData));
  };

  return (
    <div className="rydo-layout">
      {/* LEFT SIDE: NYC IMAGE */}
      <div className="nyc-visual-pane">
        <div className="hero-content">
          <h1 className="brand-logo">Rydo</h1>
          <p className="hero-text">The premium way to navigate New York City.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="form-pane">
        <div className="form-content-box">
          <header className="form-intro">
            <h2>Create Account</h2>
            <p>Join the thousands riding with Rydo.</p>
          </header>

          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">Registration successful!</div>}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <label>Full Name</label>
              <input 
                name="full_name" 
                type="text" 
                placeholder="Enter your full name" 
                onChange={handleChange} 
                required 
              />
            </div>

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

            {/* PHONE SECTION: Small Code, Big Number */}
            <div className="phone-flex-row">
              <div className="form-row code-box">
                <label>Code</label>
                <select name="country_code" value={formData.country_code} onChange={handleChange}>
                  {countries.map((c) => (
                    <option key={c.country_id || c.country_code} value={c.country_code}>
                      {c.country_code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row phone-box">
                <label>Mobile Number</label>
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="555-0123" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="split-flex-row">
              <div className="form-row">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
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
            </div>

            {/* THE SUBMIT BUTTON */}
            <button type="submit" className="rydo-submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="form-footer-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;