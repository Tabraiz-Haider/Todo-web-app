"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { clearToken, isTokenValid } from "@/lib/auth";
import { Task } from "@/lib/types";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isTokenValid()) {
      clearToken();
      router.push("/login");
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Task[]>("/tasks");
        setTasks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (values: { title: string; description?: string }) => {
    const response = await apiClient.post<Task>("/tasks", values);
    setTasks((prev) => [response.data, ...prev]);
  };

  const handleUpdateTask = async (values: { title: string; description?: string }) => {
    if (!editingTask) return;
    const response = await apiClient.put<Task>(`/tasks/${editingTask.id}`, values);
    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? response.data : task)));
    setEditingTask(null);
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    const response = await apiClient.put<Task>(`/tasks/${taskId}`, { is_completed: isCompleted });
    setTasks((prev) => prev.map((task) => (task.id === taskId ? response.data : task)));
  };

  const handleDeleteTask = async (taskId: number) => {
    await apiClient.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const completedCount = useMemo(() => tasks.filter((task) => task.is_completed).length, [tasks]);

  if (loading) {
    return <p className="text-center text-slate-500">Loading your tasks...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Your tasks</h2>
          <p className="text-sm text-slate-500">Completed {completedCount} of {tasks.length}</p>
        </div>
        <Link href="/logout" className="text-sm text-slate-500 hover:text-slate-900">
          Logout
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div>
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={setEditingTask}
          />
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">{editingTask ? "Edit task" : "Add new task"}</h3>
          <TaskForm
            key={editingTask?.id || "new"}
            initialValues={editingTask ? { title: editingTask.title, description: editingTask.description || "" } : undefined}
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            submitLabel={editingTask ? "Update task" : "Add task"}
          />
          {editingTask && (
            <button
              className="mt-4 text-sm text-slate-500 hover:text-slate-900"
              onClick={() => setEditingTask(null)}
            >
              Cancel editing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
