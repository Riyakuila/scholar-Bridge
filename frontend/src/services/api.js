import axios from 'axios';

const API = axios.create({
  baseURL: 'https://scholar-bridge-backend.onrender.com',
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;