import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1';

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
    // Prefer vendor token if present, otherwise use user token
    const vendorToken = localStorage.getItem('vendorToken');
    const userToken = localStorage.getItem('token');
    const token = vendorToken || userToken;
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
        
        // Check if it's a JWT signature error
        if (error.response.data.error === 'invalid signature' || 
            error.response.data.error === 'jwt malformed' ||
            error.response.data.error === 'jwt expired') {
          // Clear invalid token
          localStorage.removeItem('token');
          console.log('Invalid token cleared from localStorage');
          
          // Redirect to login page
          if (window.location.pathname !== '/login' && 
              window.location.pathname !== '/signup' && 
              window.location.pathname !== '/adminlogin') {
            window.location.href = '/login';
          }
        }
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