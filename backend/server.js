const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// ✅ CORS middleware (put it right after creating `app`)
app.use(cors({
  origin: "*",           // later replace "*" with your Vercel frontend URL
  credentials: true
}));

// Parsing JSON
app.use(express.json());

// Connect DB
connectDB();

// Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
