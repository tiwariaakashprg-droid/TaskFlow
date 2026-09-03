import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import TaskList from "../components/TaskList.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { getTasks, getProjects, createTask, updateTask, deleteTask } from "../api/client";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const params = {};
    if (priorityFilter) params.priority = priorityFilter;
    if (projectFilter) params.project_id = projectFilter;
    if (search) params.search = search;
    const [tasksRes, projectsRes] = await Promise.all([getTasks(params), getProjects()]);
    setTasks(tasksRes.data);
    setProjects(projectsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priorityFilter, projectFilter, search]);

  const handleToggle = async (task) => {
    await updateTask(task.id, { status: task.status === "done" ? "todo" : "done" });
    load();
  };

  const handleSave = async (payload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
    setShowModal(false);
    setEditingTask(null);
    load();
  };

  const handleDelete = async (task) => {
    await deleteTask(task.id);
    setShowModal(false);
    setEditingTask(null);
    load();
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const grouped = COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.key),
  }));

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Tasks</h1>
          <div className="topbar-sub">{tasks.length} total tasks</div>
        </div>
        <button className="btn btn-primary" onClick={openNewTaskModal} disabled={projects.length === 0}>
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="page-body">
        <div className="filter-bar">
          <div className="search-input">
            <Search />
            <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="pill-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select className="pill-select" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {projects.length === 0 && !loading && (
          <div className="card card-padded empty-state">
            You need a project before you can add tasks. Head to the Projects page to create one.
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="kanban-grid">
            {grouped.map((col) => (
              <div className="card card-padded" key={col.key}>
                <div className="kanban-col-header">
                  <span>{col.label}</span>
                  <span className="kanban-count">{col.tasks.length}</span>
                </div>
                <TaskList tasks={col.tasks} onToggle={handleToggle} onEdit={openEditModal} emptyMessage="Nothing here" />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
