// Role Selection Page (Home Page)
import React, { useState } from 'react';
import './RoleSelectionPage.css';

const RoleSelectionPage = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="role-selection-page">
      <div className="container">
        <div className="role-selection-content">
          <h1 className="title">Live Polling System</h1>
          <p className="subtitle">Select your role to continue</p>
          
          <div className="role-options">
            <div 
              className={`role-selector ${selectedRole === 'student' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('student')}
            >
              <h3>Student</h3>
              <p>Join a live poll as a participant</p>
            </div>
            
            <div 
              className={`role-selector ${selectedRole === 'teacher' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('teacher')}
            >
              <h3>Teacher</h3>
              <p>Create and manage live polls</p>
            </div>
          </div>
          
          <button 
            className="continue-btn" 
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;