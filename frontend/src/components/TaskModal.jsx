import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TaskModal({ task, projects, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    due_date: "",
    project_id: projects?.[0]?.id || "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        due_date: task.due_date ? task.due_date.slice(0, 10) : "",
        project_id: task.project_id || projects?.[0]?.id || "",
      });
    }
  }, [task]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      project_id: Number(form.project_id),
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    };
    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{task ? "Edit Task" : "New Task"}</h3>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={handleChange("title")}
              required
              placeholder="e.g. Design the new landing page"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Add more detail (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={handleChange("status")}>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={form.priority} onChange={handleChange("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <select className="form-control" value={form.project_id} onChange={handleChange("project_id")} required>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due date</label>
              <input
                type="date"
                className="form-control"
                value={form.due_date}
                onChange={handleChange("due_date")}
              />
            </div>
          </div>

          <div className="modal-actions">
            {task && (
              <button type="button" className="btn btn-danger" onClick={() => onDelete(task)} style={{ marginRight: "auto" }}>
                Delete
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
