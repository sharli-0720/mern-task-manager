import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import API from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

// ---------- Protected Route ----------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ---------- Dashboard (main page after login) ----------
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks"); // -> http://localhost:5000/api/tasks
      setTasks(res.data);
    } catch (error) {
      console.error(
        "Error fetching tasks",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (data) => {
    try {
      await API.post("/tasks", data); // -> POST /api/tasks
      await fetchTasks();
    } catch (error) {
      console.error(
        "Error adding task",
        error.response?.data || error.message
      );
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await API.put(`/tasks/${id}`, data); // -> PUT /api/tasks/:id
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      console.error(
        "Error updating task",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`); // -> DELETE /api/tasks/:id
      await fetchTasks();
    } catch (error) {
      console.error(
        "Error deleting task",
        error.response?.data || error.message
      );
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;

  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (
    <div className="app-root bg-light min-vh-100">
      {/* TOP NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-semibold">MERN Task Manager</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
              <li className="nav-item me-3 text-light small">
                Hi, {userName}
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container py-4">
        {/* Header + quick stats */}
        <div className="row mb-3">
          <div className="col-md-8">
            <h2 className="fw-bold mb-1">Task Dashboard</h2>
            <p className="text-muted mb-0">
              Manage your assignments, UI/UX work, and testing tasks in one
              place.
            </p>
          </div>
          <div className="col-md-4 mt-3 mt-md-0">
            <div className="d-flex gap-2 justify-content-md-end">
              <span className="badge bg-success">
                Completed: {completedCount}
              </span>
              <span className="badge bg-warning text-dark">
                In progress: {inProgressCount}
              </span>
              <span className="badge bg-secondary">Pending: {pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Form + Table */}
        <div className="row g-4">
          {/* Left: Form */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 pb-0">
                <h6 className="card-title fw-semibold text-primary mb-0">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h6>
              </div>
              <div className="card-body">
                <TaskForm
                  onSubmit={
                    editingTask
                      ? (data) => handleUpdate(editingTask._id, data)
                      : handleAdd
                  }
                  editingTask={editingTask}
                  onCancel={() => setEditingTask(null)}
                />
              </div>
            </div>
          </div>

          {/* Right: Task list */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                <h6 className="card-title fw-semibold text-primary mb-0">
                  Tasks
                </h6>
                <span className="badge bg-info">{tasks.length} total</span>
              </div>
              <div className="card-body">
                <TaskList
                  tasks={tasks}
                  onEdit={(task) => setEditingTask(task)}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------- Main App with routes ----------
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* any unknown route → go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
