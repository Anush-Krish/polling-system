// ChatBubble.jsx
import React, { useState } from 'react';
import ChatUI from './ChatUI';
import './ChatBubble.css';

const ChatBubble = ({ coupleId, token, partnerName, partner1, partner2 }) => {
  const [showChat, setShowChat] = useState(false);
  
  // Determine the other partner's name (not the current user)
  const otherPartner = partner1 === partnerName ? partner2 : partner1;
  
  return (
    <div className="chat-bubble-container">
      {showChat ? (
        <div className="chat-modal">
          <div className="chat-modal-content">
            <div className="chat-modal-header">
              <h3>Leave a message for {otherPartner}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowChat(false)}
              >
                ×
              </button>
            </div>
            <div className="chat-wrapper">
              <ChatUI 
                coupleId={coupleId}
                token={token}
                partnerName={partnerName}
                partner1={partner1}
                partner2={partner2}
              />
            </div>
          </div>
        </div>
      ) : (
        <button 
          className="chat-bubble" 
          onClick={() => setShowChat(true)}
          title={`Leave a message for ${otherPartner}`}
        >
          <span className="chat-icon">💬</span>
        </button>
      )}
    </div>
  );
};

export default ChatBubble;