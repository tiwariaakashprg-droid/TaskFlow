import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaecf3" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#a0a4b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#a0a4b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eaecf3", fontSize: 13 }} />
        <Area type="monotone" dataKey="created" stroke="#10b981" fill="url(#colorCreated)" strokeWidth={2} name="Created" />
        <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const STATUS_COLORS = { todo: "#a0a4b8", in_progress: "#3b82f6", done: "#10b981" };
const STATUS_LABELS = { todo: "To do", in_progress: "In progress", done: "Done" };

export function StatusPieChart({ data }) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: STATUS_LABELS[d.status], value: d.count, key: d.status }));

  if (chartData.length === 0) {
    return <div className="empty-state" style={{ padding: "30px 0" }}>No task data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
