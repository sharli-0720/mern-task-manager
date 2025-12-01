// backend/routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 all routes below require login
router.use(auth);

/**
 * CREATE TASK   POST /api/tasks
 */
router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "pending",
      userId: req.userId, // ✅ from authMiddleware
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET TASKS FOR LOGGED-IN USER   GET /api/tasks
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE TASK   PUT /api/tasks/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE TASK   DELETE /api/tasks/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
