const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const User = require("./models/User");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

const app = express();

// -------- SIMPLE CORS (allow all origins) --------
app.use(cors()); // this will add Access-Control-Allow-Origin: * for you
app.use(express.json());

// -------- DB --------
connectDB();

// -------- DEBUG ROUTE --------
app.get("/api/debug", (req, res) => {
  console.log("DEBUG hit");
  res.json({ ok: true });
});

// -------- AUTH ROUTES --------
app.post("/api/auth/register", async (req, res) => {
  console.log("Register hit with body:", req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  console.log("Login hit with body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// -------- TASK ROUTES --------
app.use("/api/tasks", taskRoutes);

// -------- HEALTH CHECK --------
app.get("/", (req, res) => {
  res.send("API is running");
});

// -------- GLOBAL ERROR HANDLER (extra safety) --------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Unexpected server error" });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
