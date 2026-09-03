import React from "react";

export default function StatCard({ icon: Icon, label, value, color = "purple" }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-decoration" />
      <div className="stat-card-icon">
        <Icon size={20} color="white" />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
