// StatusUpdate.jsx
import React, { useState, useEffect } from 'react';
import './StatusUpdate.css';
import { apiRequest } from '../services/api';

const StatusUpdate = ({ coupleId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus || 'Not updated today');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Location access denied. Status updates will not include location.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleUpdateStatus = async () => {
    if (!status.trim()) {
      alert('Please enter a status');
      return;
    }

    setIsUpdating(true);
    
    try {
      const data = await apiRequest(`/couples/${coupleId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          location: location || null  // Send null if location is not available
        })
      });

      onStatusUpdate(data.data.status);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="status-update-container">
      <h3>Update Today's Status</h3>
      
      {locationError && (
        <div className="location-error">{locationError}</div>
      )}
      
      <div className="status-form">
        <textarea
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="How are you feeling today? What's your plan?"
          rows="4"
        />
        
        <button 
          onClick={handleUpdateStatus} 
          disabled={isUpdating}
          className="update-btn"
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </div>
  );
};

export default StatusUpdate;