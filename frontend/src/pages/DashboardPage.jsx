// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import SnapSharing from '../components/SnapSharing';
import ChatBubble from '../components/ChatBubble';
import LocationDisplay from '../components/LocationDisplay';
import './DashboardPage.css';

const DashboardPage = () => {
  const [coupleData, setCoupleData] = useState(null);
  const [token, setToken] = useState('');
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    // Get session data from localStorage
    const storedToken = localStorage.getItem('coupleToken');
    const storedCoupleId = localStorage.getItem('coupleId');
    const storedPartnerName = localStorage.getItem('partnerName');
    
    if (!storedToken || !storedCoupleId || !storedPartnerName) {
      // Redirect to auth if no session data
      window.location.href = '/';
      return;
    }
    
    setToken(storedToken);
    setPartnerName(storedPartnerName);
    
    // Get couple data
    const fetchCoupleData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/couples/${storedCoupleId}`, {
          headers: {
            'Authorization': storedToken
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch couple data');
        }
        
        const data = await response.json();
        setCoupleData(data.data);
      } catch (error) {
        console.error('Error fetching couple data:', error);
      }
    };
    
    fetchCoupleData();
  }, []);

  // Initialize scroll position to top when component first renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  

  // Initialize scroll position to top when component first renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!coupleData) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome, {partnerName}!</h1>
        <p>You are connected to: <strong>{coupleData.coupleName}</strong></p>
        
        <div className="dashboard-card snaps-card">
          <SnapSharing 
            coupleId={coupleData._id} 
            token={token}
            partnerName={partnerName}
          />
        </div>
        
        <div className="dashboard-card location-card">
          <LocationDisplay 
            coupleId={coupleData._id} 
            token={token} 
          />
        </div>
      </div>
      
      <ChatBubble
        coupleId={coupleData._id}
        token={token}
        partnerName={partnerName}
        partner1={coupleData.partner1}
        partner2={coupleData.partner2}
      />
    </div>
  );
};

export default DashboardPage;