// Header component for Flixy
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onLogout, isAuthenticated }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">Flixy</h1>
          </Link>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;