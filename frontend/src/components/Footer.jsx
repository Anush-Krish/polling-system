// Footer component for Live Polling System
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Live Polling System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;