import React from "react";
import { Check, Calendar, ClipboardList } from "lucide-react";
import { format, isPast } from "date-fns";

const PRIORITY_LABEL = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };
const STATUS_LABEL = { todo: "To do", in_progress: "In progress", done: "Done" };

export default function TaskList({ tasks, onToggle, onEdit, emptyMessage = "No tasks yet" }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList />
        <div>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => {
        const overdue =
          task.due_date && task.status !== "done" && isPast(new Date(task.due_date));
        return (
          <div className="task-row" key={task.id}>
            <div
              className={`task-checkbox ${task.status === "done" ? "checked" : ""}`}
              onClick={() => onToggle(task)}
            >
              {task.status === "done" && <Check size={13} strokeWidth={3} />}
            </div>
            <div className="task-main" onClick={() => onEdit && onEdit(task)} style={{ cursor: onEdit ? "pointer" : "default" }}>
              <div className={`task-title ${task.status === "done" ? "done" : ""}`}>
                {task.title}
              </div>
              <div className="task-meta">
                <span className={`badge badge-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
                <span className={`badge badge-${task.status}`}>{STATUS_LABEL[task.status]}</span>
                {task.due_date && (
                  <span style={{ color: overdue ? "var(--danger)" : "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} />
                    {format(new Date(task.due_date), "MMM d")}
                    {overdue ? " (overdue)" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
