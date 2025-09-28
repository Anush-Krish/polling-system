// Example API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Generic function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Poll-related API functions
const pollService = {
  // Get all polls
  getAllPolls: () => apiRequest('/polls'),

  // Get a specific poll by ID
  getPollById: (id) => apiRequest(`/polls/${id}`),

  // Create a new poll
  createPoll: (pollData) => apiRequest('/polls', {
    method: 'POST',
    body: JSON.stringify(pollData),
  }),

  // Vote on a poll
  voteOnPoll: (pollId, optionIndex) => apiRequest(`/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionIndex }),
  }),
};

export default pollService;