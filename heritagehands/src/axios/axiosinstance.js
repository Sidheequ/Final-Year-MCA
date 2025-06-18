import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1';

const axiosinstance = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 10000,
});

// Request interceptor
axiosinstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
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
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;