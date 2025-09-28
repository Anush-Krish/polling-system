// Student Poll View Page
import React, { useState, useEffect } from 'react';
import './StudentPollViewPage.css';

const StudentPollViewPage = ({ poll, onVote, studentName, onLeave }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResultsAfterVoting, setShowResultsAfterVoting] = useState(false); // Whether to show results after voting
  const [currentPoll, setCurrentPoll] = useState(poll);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for the poll
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update currentPoll when parent poll prop changes
  useEffect(() => {
    setCurrentPoll(poll);
    
    // Check if the student has already voted
    if (poll && poll.options) {
      // In a real implementation, you'd track if this particular student has voted
      // For now, we'll just set hasVoted to true if any votes exist
      const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      if (totalVotes > 0) {
        setHasVoted(true);
      }
    }
  }, [poll]);

  // Timer effect - counts down from 60 seconds
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Timer reached 0 - poll is over
      if (!hasVoted) {
        // If the student hasn't voted, disable voting
        setHasVoted(true);
      }
    }
  }, [timeLeft, hasVoted]);

  // Reset timer when a new poll is received
  useEffect(() => {
    if (poll) {
      setTimeLeft(60);
      setHasVoted(false);
    }
  }, [poll]);

  const handleVote = () => {
    if (selectedOption !== null && !hasVoted) {
      setLoading(true);
      setError(null);
      
      try {
        // Call parent function to vote via socket
        onVote(selectedOption);
        setHasVoted(true);
        setShowResultsAfterVoting(true); // Show results after voting
      } catch (err) {
        setError(err.message);
        console.error('Error voting:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOptionSelect = (index) => {
    if (!hasVoted && timeLeft > 0) {
      setSelectedOption(index);
    }
  };

  // Calculate total votes for results display
  const totalVotes = currentPoll.options ? 
    currentPoll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0) : 0;

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="student-poll-view-page">
      <div className="container">
        <div className="poll-header">
          <h1 className="poll-title">{currentPoll.question}</h1>
          <div className="timer">
            <span className={`time-left ${timeLeft <= 10 ? 'time-warning' : ''}`}>
              {formatTime(timeLeft)}
            </span>
            <button className="leave-btn" onClick={onLeave}>Leave Poll</button>
          </div>
        </div>
        
        <div className="poll-content">
          {error && <div className="error-message">Error: {error}</div>}
          
          <div className="options-section">
            <h2>Options</h2>
            <div className="options-list">
              {currentPoll.options && currentPoll.options.map((option, index) => (
                <div 
                  key={option._id || option.id || index}
                  className={`option-box ${selectedOption === index ? 'option-selected' : ''} ${hasVoted || timeLeft <= 0 ? 'disabled' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <span>{option.text}</span>
                  {hasVoted && (
                    <span className="vote-count">({option.votes || 0} votes)</span>
                  )}
                </div>
              ))}
            </div>
            
            {!hasVoted && timeLeft > 0 && (
              <button 
                className="vote-btn" 
                onClick={handleVote}
                disabled={selectedOption === null || loading}
              >
                {loading ? 'Voting...' : 'Vote'}
              </button>
            )}
            
            {(hasVoted || timeLeft <= 0 || showResultsAfterVoting) && currentPoll.options && (
              <div className="results-section">
                <h3>Results</h3>
                {currentPoll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? 
                    Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                  
                  return (
                    <div key={option._id || option.id || index} className="result-item">
                      <div className="result-header">
                        <span>{option.text}</span>
                        <span>{percentage}% ({option.votes || 0})</span>
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
            )}
          </div>
          
          <div className="info-section">
            <div className="student-info">
              <h3>Student</h3>
              <p>{studentName}</p>
            </div>
            <div className="poll-info">
              <h3>Poll ID</h3>
              <p>{currentPoll._id || currentPoll.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPollViewPage;