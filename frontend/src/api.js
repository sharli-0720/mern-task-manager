import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-backend-i4jgg.onrender.com"
});

// Add token to each request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;