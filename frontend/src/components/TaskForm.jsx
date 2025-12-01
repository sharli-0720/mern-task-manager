// src/components/TaskForm.jsx
import React, { useEffect, useState } from "react";

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  // when editing, load the existing task values
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "pending",
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form); // parent (Dashboard) does the API call
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={form.status}
          onChange={handleChange}
        >
          {/* values MUST match Task.js enum */}
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {editingTask ? "Update" : "Add"}
        </button>
        {editingTask && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
