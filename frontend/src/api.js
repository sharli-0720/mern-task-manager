import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-backend-i4jgg.onrender.com/api",
  withCredentials: true,
});

export default API;
