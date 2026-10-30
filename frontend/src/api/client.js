import axios from 'axios';

// All requests go to /api, which Vite forwards to the backend (see vite.config.js)
const api = axios.create({ baseURL: '/api' });

// Add the login token to every request, if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
