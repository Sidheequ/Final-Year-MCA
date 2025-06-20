import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosinstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosinstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('With Credentials:', config.withCredentials);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosinstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        console.error('Unauthorized - User needs to login');
        // You can redirect to login here if needed
      } else if (error.response.status === 404) {
        console.error('API endpoint not found');
      } else if (error.response.status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      console.error('Network error - No response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;