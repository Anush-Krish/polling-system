// Teacher Create Poll Page
import React, { useState } from 'react';
import './TeacherCreatePollPage.css';

const TeacherCreatePollPage = ({ onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && options.filter(opt => opt.trim()).length >= 2) {
      setLoading(true);
      setError(null);
      
      try {
        const pollData = {
          question: question.trim(),
          options: options.filter(opt => opt.trim()).map((opt) => ({
            text: opt.trim()
          }))
        };
        
        // Call parent function to create poll via socket
        onCreatePoll(pollData);
      } catch (err) {
        setError(err.message);
        console.error('Error creating poll:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="teacher-create-poll-page">
      <div className="container">
        <div className="create-poll-content">
          <h1 className="title">Create New Poll</h1>
          
          {error && <div className="error-message">Error: {error}</div>}
          
          <form onSubmit={handleSubmit} className="create-poll-form">
            <div className="form-group">
              <label htmlFor="question" className="label">Question</label>
              <textarea
                id="question"
                className="input textarea"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <div className="label-with-button">
                <label className="label">Options</label>
                <button 
                  type="button" 
                  className="add-option-btn" 
                  onClick={addOption}
                  disabled={loading}
                >
                  + Add Option
                </button>
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <input
                    type="text"
                    className="input"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    disabled={loading}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => removeOption(index)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="submit" 
              className="create-poll-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreatePollPage;