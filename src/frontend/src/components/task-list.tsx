"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import { CheckCircle2, Circle, Edit, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: number, isCompleted: boolean) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => Number(a.is_completed) - Number(b.is_completed));
  }, [tasks]);

  if (!tasks.length) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center text-slate-500">
        No tasks yet. Add one to get started!
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {sortedTasks.map((task) => (
        <li key={task.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <button
              className="mt-1 text-slate-500 hover:text-slate-900"
              onClick={() => onToggleComplete(task.id, !task.is_completed)}
              aria-label={task.is_completed ? "Mark incomplete" : "Mark complete"}
            >
              {task.is_completed ? <CheckCircle2 className="text-green-600" /> : <Circle />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${task.is_completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {task.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {dayjs(task.updated_at).format("MMM D, HH:mm")}
                </span>
              </div>
              {task.description && <p className="mt-2 text-sm text-slate-600">{task.description}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
