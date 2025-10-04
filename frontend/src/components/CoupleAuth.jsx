// CoupleAuth.jsx
import React, { useState } from 'react';
import './CoupleAuth.css';

const CoupleAuth = ({ onAuthSuccess }) => {
  const [isCreating, setIsCreating] = useState(false);
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
      let response;
      
      if (isCreating) {
        // Creating a new couple
        response = await fetch('http://localhost:5001/api/couples/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coupleName: formData.coupleName,
            partner1: formData.partner1,
            partner2: formData.partner2,
            accessCode: formData.accessCode
          })
        });
      } else {
        // Joining existing couple
        response = await fetch('http://localhost:5001/api/couples/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessCode: formData.accessCode,
            partnerName: formData.partnerName
          })
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const data = await response.json();
      
      // Create session for the authenticated partner
      const sessionResponse = await fetch('http://localhost:5001/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coupleId: data.data._id,
          accessCode: formData.accessCode,
          partnerName: isCreating ? formData.partner1 : formData.partnerName
        })
      });
      
      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }
      
      const sessionData = await sessionResponse.json();
      
      // Store token in localStorage
      localStorage.setItem('coupleToken', sessionData.data.token);
      localStorage.setItem('coupleId', data.data._id);
      localStorage.setItem('partnerName', isCreating ? formData.partner1 : formData.partnerName);
      
      onAuthSuccess(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isCreating ? 'Create Couple Account' : 'Join Couple Account'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isCreating && (
            <>
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
                <label htmlFor="partner1">Your Name</label>
                <input
                  type="text"
                  id="partner1"
                  name="partner1"
                  value={formData.partner1}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="partner2">Partner's Name</label>
                <input
                  type="text"
                  id="partner2"
                  name="partner2"
                  value={formData.partner2}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          
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
          
          {!isCreating && (
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
          )}
          
          <button type="submit" className="auth-btn">
            {isCreating ? 'Create Account' : 'Join Account'}
          </button>
        </form>
        
        <div className="toggle-auth">
          {isCreating ? (
            <p>Already have an account? <button onClick={() => setIsCreating(false)}>Join here</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => setIsCreating(true)}>Create one</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoupleAuth;