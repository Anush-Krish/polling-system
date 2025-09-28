// Kicked Out Page
import React from 'react';
import './KickedOutPage.css';

const KickedOutPage = ({ onReturnToRoleSelection }) => {
  return (
    <div className="kicked-out-page">
      <div className="kicked-out-content">
        <div className="kicked-out-icon">❌</div>
        <h1 className="kicked-out-title">Kicked Out</h1>
        <p className="kicked-out-message">
          You have been kicked out of the poll by the teacher. 
          You can no longer participate in this session.
        </p>
        <button 
          className="return-btn" 
          onClick={onReturnToRoleSelection}
        >
          Return to Role Selection
        </button>
      </div>
    </div>
  );
};

export default KickedOutPage;