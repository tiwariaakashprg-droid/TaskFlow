import React, { useState, useEffect } from "react";
import { ListChecks, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { TrendChart, StatusPieChart } from "../components/Charts.jsx";
import { getDashboardStats, getProjects, updateTask, createTask, deleteTask } from "../api/client";
import { useAuth } from "../App.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [statsRes, projectsRes] = await Promise.all([getDashboardStats(), getProjects()]);
    setStats(statsRes.data);
    setProjects(projectsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (task) => {
    await updateTask(task.id, { status: task.status === "done" ? "todo" : "done" });
    load();
  };

  const handleCreate = async (payload) => {
    await createTask(payload);
    setShowModal(false);
    load();
  };

  if (loading) return <div className="loading-screen">Loading dashboard…</div>;

  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Welcome back, {firstName} 👋</h1>
          <div className="topbar-sub">Here's what's happening with your work today.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="page-body">
        <div className="stat-grid">
          <StatCard icon={ListChecks} label="Total Tasks" value={stats.total_tasks} color="purple" />
          <StatCard icon={CheckCircle2} label={`Completed · ${stats.completion_rate}%`} value={stats.completed_tasks} color="green" />
          <StatCard icon={Clock} label="Pending" value={stats.pending_tasks} color="orange" />
          <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue_tasks} color="red" />
        </div>

        <div className="dashboard-grid">
          <div className="card card-padded">
            <div className="section-header">
              <h2>Activity — last 7 days</h2>
            </div>
            <TrendChart data={stats.trend} />
          </div>

          <div className="card card-padded">
            <div className="section-header">
              <h2>Status Breakdown</h2>
            </div>
            <StatusPieChart data={stats.status_breakdown} />
          </div>
        </div>

        <div className="card card-padded">
          <div className="section-header">
            <h2>Recently Updated Tasks</h2>
          </div>
          <TaskList tasks={stats.recent_tasks} onToggle={handleToggle} emptyMessage="No tasks yet — create your first one!" />
        </div>
      </div>

      {showModal && (
        <TaskModal projects={projects} onClose={() => setShowModal(false)} onSave={handleCreate} />
      )}
    </>
  );
}
