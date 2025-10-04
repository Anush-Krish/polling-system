// Main App Component for Flixy
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CoupleAuth from './components/CoupleAuth';
import DashboardPage from './pages/DashboardPage';
import './styles/App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('coupleToken');
    const coupleId = localStorage.getItem('coupleId');
    const partnerName = localStorage.getItem('partnerName');
    
    if (token && coupleId && partnerName) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleAuthSuccess = (coupleData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('coupleToken');
    localStorage.removeItem('coupleId');
    localStorage.removeItem('partnerName');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <CoupleAuth onAuthSuccess={handleAuthSuccess} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <DashboardPage /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;