// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-task-manager-2-cl4y.onrender.com/api",
});

export default API;
