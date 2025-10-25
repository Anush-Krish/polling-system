// CoupleAuth.jsx
import React, { useState } from 'react';
import './CoupleAuth.css';
import { apiRequest } from '../services/api';

const CoupleAuth = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    coupleName: '',
    partner1: '',
    partner2: '',
    accessCode: '',
    partnerName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await apiRequest('/couples/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          coupleName: formData.coupleName,
          accessCode: formData.accessCode,
          partnerName: formData.partnerName
        })
      });
      
      // Store token and couple data in localStorage
      localStorage.setItem('coupleToken', data.data.token);
      localStorage.setItem('coupleId', data.data._id);
      localStorage.setItem('partnerName', formData.partnerName);
      
      onAuthSuccess(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join Couple Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="coupleName">Couple Name</label>
            <input
              type="text"
              id="coupleName"
              name="coupleName"
              value={formData.coupleName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="accessCode">Access Code</label>
            <input
              type="password"
              id="accessCode"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="partnerName">Your Name</label>
            <input
              type="text"
              id="partnerName"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-btn">
            Join Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoupleAuth;