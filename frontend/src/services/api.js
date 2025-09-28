// API service for connecting to the backend
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

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

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

// Authentication API functions
const authAPI = {
  // Register a new user
  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Login user
  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get user profile
  getProfile: () => apiRequest('/users/profile'),

  // Update user profile
  updateProfile: (userData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Poll API functions
const pollAPI = {
  // Create a new poll
  createPoll: (pollData) => apiRequest('/polls', {
    method: 'POST',
    body: JSON.stringify(pollData),
  }),

  // Get all polls
  getAllPolls: () => apiRequest('/polls'),

  // Get a specific poll by ID
  getPollById: (id) => apiRequest(`/polls/${id}`),

  // Update a poll
  updatePoll: (id, pollData) => apiRequest(`/polls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pollData),
  }),

  // Delete a poll
  deletePoll: (id) => apiRequest(`/polls/${id}`, {
    method: 'DELETE',
  }),

  // Vote on a poll
  voteOnPoll: (pollId, optionIndex) => apiRequest(`/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionIndex }),
  }),

  // Add a participant to a poll
  addParticipant: (pollId, participantName) => apiRequest(`/polls/${pollId}/participate`, {
    method: 'POST',
    body: JSON.stringify({ name: participantName }),
  }),

  // Remove a participant from a poll
  removeParticipant: (pollId, participantId) => apiRequest(`/polls/${pollId}/participant/${participantId}`, {
    method: 'DELETE',
  }),

  // End a poll
  endPoll: (pollId) => apiRequest(`/polls/${pollId}/end`, {
    method: 'PUT',
  }),
};

export { authAPI, pollAPI };