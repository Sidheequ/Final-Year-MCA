import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosinstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});


export {axiosinstance} 