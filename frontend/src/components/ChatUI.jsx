// ChatUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ChatUI.css';

const ChatUI = ({ coupleId, token, partnerName, partner1, partner2 }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // Determine the other partner's name (not the current user)
  const otherPartner = partner1 === partnerName ? partner2 : partner1;

  useEffect(() => {
    fetchChatHistory();
    
    // Set up polling to check for new messages every 5 seconds
    const interval = setInterval(fetchChatHistory, 5000);
    
    return () => clearInterval(interval);
  }, [coupleId, token]);

  // Monitor scroll position to determine if we should auto-scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Calculate if we're near the bottom
      const threshold = 30; // pixels from bottom
      const position = container.scrollTop + container.clientHeight;
      const height = container.scrollHeight;
      
      // Auto-scroll when near bottom, stop auto-scrolling when user scrolls up
      shouldAutoScroll.current = position >= height - threshold;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom only if shouldAutoScroll is true
  useEffect(() => {
    if (shouldAutoScroll.current && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/chat/history/${coupleId}`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError(error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          coupleId,
          sender: partnerName,
          content: newMessage.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <h3>Leave a message for {otherPartner}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map(message => (
          <div 
            key={message._id} 
            className={`message ${message.sender === partnerName ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <div className="message-header">
                <div className="sender-name-time">
                  <span className="sender-name">{message.sender}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
};

export default ChatUI;