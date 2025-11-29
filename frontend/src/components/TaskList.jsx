import React from "react";

function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks.length) {
    return <p className="text-muted">No tasks yet. Add one above.</p>;
  }

  const badgeClass = (status) => {
    if (status === "completed") return "badge bg-success";
    if (status === "in-progress") return "badge bg-warning text-dark";
    return "badge bg-secondary";
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Tasks</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span className={badgeClass(task.status)}>
                      {task.status}
                    </span>
                  </td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
