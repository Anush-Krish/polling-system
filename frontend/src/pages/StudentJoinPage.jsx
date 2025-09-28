// Student Join Page
import React, { useState } from 'react';
import './StudentJoinPage.css';

const StudentJoinPage = ({ onJoinPoll }) => {
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = (e) => {
    e.preventDefault();
    
    if (!studentName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call parent function with student name
      onJoinPoll({ studentName: studentName.trim() });
    } catch (err) {
      setError(err.message);
      console.error('Error joining poll:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-join-page">
      <div className="container">
        <div className="student-join-content">
          <h1 className="title">Join Live Poll</h1>
          <p className="subtitle">Enter your name to join</p>
          
          {error && <div className="error-message">Error: {error}</div>}
          
          <form onSubmit={handleJoin} className="join-form">
            <div className="form-group">
              <label htmlFor="studentName" className="label">Your Name</label>
              <input
                type="text"
                id="studentName"
                className="input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="join-btn" disabled={loading}>
              {loading ? 'Joining...' : 'Join Poll'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentJoinPage;