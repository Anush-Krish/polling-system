// API service for connecting to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
  const token = localStorage.getItem('coupleToken'); // Changed from 'token' to 'coupleToken'
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = token; // Token is already 'Bearer <token>' from backend
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401 || response.status === 403) {
      // Handle unauthorized or forbidden access - logout user
      localStorage.removeItem('coupleToken');
      localStorage.removeItem('coupleId');
      localStorage.removeItem('partnerName');
      window.location.href = '/'; // Redirect to home/login page
      throw new Error('Session expired or unauthorized. Please log in again.');
    }

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

export { apiRequest };