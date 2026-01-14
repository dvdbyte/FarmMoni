import axios from 'axios';

const API_URL = "https://farmmoni-f4hk.onrender.com/api"

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;