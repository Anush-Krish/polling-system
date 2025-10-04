// LocationDisplay.jsx
import React, { useState, useEffect } from 'react';
import './LocationDisplay.css';

const LocationDisplay = ({ coupleId, token }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoupleLocation = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/couples/${coupleId}`, {
          headers: {
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch couple data');
        }

        const data = await response.json();
        setLocation(data.data.location);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching couple location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupleLocation();
  }, [coupleId, token]);

  if (loading) {
    return <div className="location-display loading">Loading location...</div>;
  }

  if (error) {
    return <div className="location-display error">Location: Error - {error}</div>;
  }

  if (!location) {
    return <div className="location-display">Location: Not available</div>;
  }

  return (
    <div className="location-display">
      <h4>Current Location</h4>
      <div className="location-info">
        {location?.lat && location?.lng ? (
          <div className="coordinates">
            <span className="label">Lat:</span> <span className="value">{location.lat.toFixed(6)}</span>
            <span className="label">Lng:</span> <span className="value">{location.lng.toFixed(6)}</span>
          </div>
        ) : (
          <div className="no-location">Location not available</div>
        )}
        {location?.address && (
          <div className="address">
            <span className="label">Address:</span> <span className="value">{location.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDisplay;