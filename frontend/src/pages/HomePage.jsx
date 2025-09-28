// HomePage component for Live Polling System
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to the Live Polling System</h1>
        <p>Select your role to participate in real-time polling</p>
      </section>
      
      <section className="instructions">
        <div className="instruction-card">
          <h3>For Teachers</h3>
          <p>Create live polls that students can join and respond to in real-time</p>
        </div>
        <div className="instruction-card">
          <h3>For Students</h3>
          <p>Join live polls and submit responses that are updated instantly</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;