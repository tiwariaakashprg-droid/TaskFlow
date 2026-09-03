import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, CheckSquare, FolderKanban, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../App.jsx";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Projects", path: "/projects", icon: FolderKanban },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles size={18} color="white" />
        </div>
        TaskFlow
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={18} />
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={logout} title="Sign out">
          <div className="avatar" style={{ background: user?.avatar_color || "#6366F1" }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
          <LogOut size={16} color="#9497b8" />
        </div>
      </div>
    </aside>
  );
}
