// Example PollCard component
import React from 'react';
import './PollCard.css';

const PollCard = ({ poll }) => {
  // Calculate total votes for percentage calculations
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="poll-card">
      <h3 className="poll-title">{poll.title}</h3>
      <div className="poll-info">
        <span>Created by: {poll.creator}</span>
        <span>Created: {poll.createdAt}</span>
      </div>
      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <div key={index} className="poll-option">
              <div className="option-text">{option.text}</div>
              <div className="option-results">
                <div className="results-bar-container">
                  <div 
                    className="results-bar" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="results-text">
                  {option.votes} votes ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="poll-footer">
        <button className="vote-btn">Vote</button>
        <span className="total-votes">Total votes: {totalVotes}</span>
      </div>
    </div>
  );
};

export default PollCard;