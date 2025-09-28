// Teacher Poll Management Page
import React, { useState, useEffect } from 'react';
import './TeacherPollManagementPage.css';

const TeacherPollManagementPage = ({ poll, pollId, onEndPoll, onKickoutStudent, participants }) => {
  const [activeTab, setActiveTab] = useState('results'); // 'results' or 'participants'
  const [currentPoll, setCurrentPoll] = useState(poll);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for the poll

  // Update currentPoll when parent poll prop changes
  useEffect(() => {
    setCurrentPoll(poll);
    
    // Reset timer when a new poll is received
    if (poll) {
      setTimeLeft(60);
    }
  }, [poll]);

  // Timer effect - counts down from 60 seconds
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Calculate total votes
  const totalVotes = currentPoll.options ? 
    currentPoll.options.reduce((sum, option) => sum + (option.votes || 0), 0) : 0;

  const handleEndPoll = () => {
    onEndPoll();
  };

  const handleKickoutStudent = (studentSocketId) => {
    onKickoutStudent(studentSocketId);
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="teacher-poll-management-page">
      <div className="container">
        <div className="poll-header">
          <div className="poll-title-section">
            <h1 className="poll-title">{currentPoll.question}</h1>
            <div className="poll-info">
              <p className="poll-id">Poll ID: {pollId || currentPoll._id}</p>
              <span className={`time-left ${timeLeft <= 10 ? 'time-warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <button 
            className="end-poll-btn" 
            onClick={handleEndPoll}
          >
            End Poll
          </button>
        </div>
        
        <div className="poll-content">
          <div className="results-section">
            <h2>Results</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Votes</span>
                <span className="stat-value">{totalVotes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Participants</span>
                <span className="stat-value">{participants ? participants.length : 0}</span>
              </div>
            </div>
            
            <div className="options-results">
              {currentPoll.options && currentPoll.options.map((option, index) => {
                const percentage = totalVotes > 0 ? 
                  Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                
                return (
                  <div key={option._id || option.id || index} className="result-item">
                    <div className="result-header">
                      <span className="option-text">{option.text}</span>
                      <span className="result-stats">{percentage}% ({option.votes || 0})</span>
                    </div>
                    <div className="results-bar">
                      <div 
                        className="results-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="participants-section">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Results
              </button>
              <button 
                className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                Participants
              </button>
            </div>
            
            {activeTab === 'results' && currentPoll.options && (
              <div className="tab-content results-tab">
                <h3>Top Responses</h3>
                {currentPoll.options
                  .map((option, index) => ({ ...option, index }))
                  .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                  .slice(0, 3)
                  .map((option) => (
                    <div key={option._id || option.id || option.index} className="top-response">
                      <span className="option-text">{option.text}</span>
                      <span className="vote-count">({option.votes || 0} votes)</span>
                    </div>
                  ))}
              </div>
            )}
            
            {activeTab === 'participants' && (
              <div className="tab-content participants-tab">
                <h3>Participants ({participants ? participants.length : 0})</h3>
                <div className="participant-list">
                  {participants && participants.map((participant) => (
                    <div key={participant.id} className="participant-item">
                      <div className="participant-info">
                        <span className="participant-name">{participant.name}</span>
                        <span className="participant-status joined">
                          Joined
                        </span>
                      </div>
                      <button 
                        className="kickout-btn"
                        onClick={() => handleKickoutStudent(participant.id)}
                      >
                        Kickout
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPollManagementPage;