// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import SnapSharing from '../components/SnapSharing';
import ChatBubble from '../components/ChatBubble';
import './DashboardPage.css';
import { apiRequest } from '../services/api';
import { SocketProvider } from '../context/SocketContext';

const DashboardPage = () => {
  const [coupleData, setCoupleData] = useState(null);
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    // Get session data from localStorage
    const storedCoupleId = localStorage.getItem('coupleId');
    const storedPartnerName = localStorage.getItem('partnerName');
    
    if (!storedCoupleId || !storedPartnerName) {
      // Redirect to auth if no session data
      window.location.href = '/';
      return;
    }
    
    setPartnerName(storedPartnerName);
    
    // Get couple data
    const fetchCoupleData = async () => {
      try {
        const data = await apiRequest(`/couples/${storedCoupleId}`);
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
    <SocketProvider>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1>Welcome, {partnerName}!</h1>
          <p>You are connected to: <strong>{coupleData.coupleName}</strong></p>
          
          <div className="dashboard-card snaps-card">
            <SnapSharing 
              coupleId={coupleData._id} 
              partnerName={partnerName}
            />
          </div>
        </div>
        
        <ChatBubble
          coupleId={coupleData._id}
          partnerName={partnerName}
          partner1={coupleData.partner1}
          partner2={coupleData.partner2}
        />
      </div>
    </SocketProvider>
  );
};

export default DashboardPage;