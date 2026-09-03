import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const COLORS = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444", "#14B8A6"];

export default function ProjectModal({ project, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ name: "", description: "", color: COLORS[0] });

  useEffect(() => {
    if (project) {
      setForm({ name: project.name, description: project.description, color: project.color });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{project ? "Edit Project" : "New Project"}</h3>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's this project about?"
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c,
                    cursor: "pointer",
                    border: form.color === c ? "3px solid #1a1d29" : "3px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {project && (
              <button type="button" className="btn btn-danger" onClick={() => onDelete(project)} style={{ marginRight: "auto" }}>
                Delete
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
