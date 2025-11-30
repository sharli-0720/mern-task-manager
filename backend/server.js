const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// -------- CORS CONFIG --------
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://profound-longma-ed6be0.netlify.app", // your Netlify URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// enable CORS for all routes
app.use(cors(corsOptions));

// ❌ REMOVE THIS — it was crashing Render
// app.options("*", cors(corsOptions));

app.use(express.json());

// -------- DB --------
connectDB();

// -------- ROUTES --------

// all auth routes start with /api/auth
app.use("/api/auth", authRoutes);

// all task routes start with /api/tasks
app.use("/api/tasks", taskRoutes);

// basic health check route (optional, but helps debugging)
app.get("/", (req, res) => {
  res.send("API is running");
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
