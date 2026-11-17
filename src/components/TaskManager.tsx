import { useState } from "react";
import StatsBar from "./StatsBar";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import type { FilterType, Priority, Todo } from "../types";

const FILTERS: FilterType[] = ["all", "active", "completed"];

const EMPTY: Record<FilterType, { title: string; hint: string }> = {
  all: { title: "No tasks yet", hint: "Add your first task above to get started." },
  active: { title: "Nothing left to do", hint: "Every task is complete. Nice work." },
  completed: { title: "No completed tasks", hint: "Tick a task off and it will appear here." },
};

const makeSeed = (): Todo[] => {
  const now = Date.now();
  return [
    { id: crypto.randomUUID(), text: "Review immutable state updates", priority: "High", completed: false, createdAt: now - 3_600_000 },
    { id: crypto.randomUUID(), text: "Type every event handler", priority: "Medium", completed: true, createdAt: now - 7_200_000 },
  ];
};

export default function TaskManager() {
  // Rules of Hooks: all hooks at the top level, same order every render.
  // Re-renders: any setter below schedules a new render of TaskManager and
  // its children; React then patches only the DOM that changed.
  const [todos, setTodos] = useState<Todo[]>(makeSeed); // lazy initializer runs once
  const [filter, setFilter] = useState<FilterType>("all");

  // ---- Derived state: calculated every render, never stored ----
  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = total - completedCount;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );
  const countFor = (f: FilterType): number => (f === "all" ? total : f === "active" ? activeCount : completedCount);

  // ---- Handlers: functional updaters + non-mutating array methods ----
  const addTodo = (text: string, priority: Priority) =>
    setTodos((prev) => [{ id: crypto.randomUUID(), text, priority, completed: false, createdAt: Date.now() }, ...prev]);

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const saveTodo = (id: string, text: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <div className="space-y-4">
      <StatsBar total={total} active={activeCount} completed={completedCount} percent={percent} />
      <TaskForm onAdd={addTodo} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1" role="group" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); setFilter(f); }}
              className={`focus-ring rounded-full px-3 py-1 text-sm font-semibold capitalize transition ${
                filter === f ? "bg-white text-slate-900" : "text-slate-400 hover:bg-white/10"
              }`}
            >
              {f} <span className="opacity-60">{countFor(f)}</span>
            </button>
          ))}
        </div>
        {/* Conditional rendering — logical &&: only when something is completed */}
        {completedCount > 0 && (
          <button onClick={clearCompleted} className="focus-ring rounded-lg px-3 py-1 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15">
            Clear {completedCount} completed
          </button>
        )}
      </div>

      {/* Ternary: empty state for the active filter vs. the list */}
      {visible.length === 0 ? (
        <div className="glass border-dashed px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold">{EMPTY[filter].title}</p>
          <p className="mt-1 text-sm text-slate-400">{EMPTY[filter].hint}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((todo) => (
            <TaskItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onSave={saveTodo} />
          ))}
        </ul>
      )}
    </div>
  );
}
