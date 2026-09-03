import React, { useState, useEffect } from "react";
import { Plus, FolderKanban } from "lucide-react";
import ProjectModal from "../components/ProjectModal.jsx";
import { getProjects, createProject, updateProject, deleteProject } from "../api/client";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await getProjects();
    setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (payload) => {
    if (editingProject) {
      await updateProject(editingProject.id, payload);
    } else {
      await createProject(payload);
    }
    setShowModal(false);
    setEditingProject(null);
    load();
  };

  const handleDelete = async (project) => {
    await deleteProject(project.id);
    setShowModal(false);
    setEditingProject(null);
    load();
  };

  if (loading) return <div className="loading-screen">Loading projects…</div>;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Projects</h1>
          <div className="topbar-sub">{projects.length} active projects</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="page-body">
        {projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban />
            <div>No projects yet. Create your first project to get started.</div>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => {
              const pct = project.task_count
                ? Math.round((project.completed_count / project.task_count) * 100)
                : 0;
              return (
                <div
                  className="card project-card"
                  key={project.id}
                  onClick={() => {
                    setEditingProject(project);
                    setShowModal(true);
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span className="project-color-dot" style={{ background: project.color }} />
                    <strong style={{ fontSize: 15.5 }}>{project.name}</strong>
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--text-secondary)", minHeight: 20 }}>
                    {project.description || "No description"}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12.5, color: "var(--text-secondary)" }}>
                    <span>{project.completed_count} / {project.task_count} tasks done</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="project-progress-track">
                    <div className="project-progress-fill" style={{ width: `${pct}%`, background: project.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
