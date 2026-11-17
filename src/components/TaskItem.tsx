import { useState } from "react";
import type { Priority, Todo } from "../types";

const BADGE: Record<Priority, string> = {
  Low: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  Medium: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  High: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
};

const formatTime = (ts: number): string =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(ts);

interface TaskItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, text: string) => void;
}

export default function TaskItem({ todo, onToggle, onDelete, onSave }: TaskItemProps) {
  // Each row owns its edit state: toggling edit mode re-renders only this row.
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const startEdit = () => { setEditText(todo.text); setIsEditing(true); };

  const commit = () => {
    const next = editText.trim();
    if (next && next !== todo.text) onSave(todo.id, next);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();              // Enter saves
    else if (e.key === "Escape") setIsEditing(false); // Escape cancels
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  return (
    <li className="glass group flex items-center gap-3 px-4 py-3 transition hover:border-indigo-400/40">
      <button
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`Mark "${todo.text}" ${todo.completed ? "active" : "complete"}`}
        onClick={() => onToggle(todo.id)}
        className={`focus-ring grid size-6 shrink-0 place-items-center rounded-full border transition ${
          todo.completed ? "border-indigo-400 bg-indigo-500" : "border-white/25 hover:border-indigo-300"
        }`}
      >
        {/* Conditional rendering #1 — logical &&: the checkmark exists only when completed */}
        {todo.completed && (
          <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-white stroke-[2.5]"><path d="M5 10.5l3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {/* Conditional rendering #2 — ternary: edit input vs. read-only text */}
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            aria-label="Edit task"
            className="focus-ring w-full rounded-md bg-slate-900 px-2 py-1"
          />
        ) : (
          <p
            onDoubleClick={startEdit}
            title="Double-click to edit"
            className={`break-words transition ${todo.completed ? "text-slate-500 line-through" : ""}`}
          >
            {todo.text}
          </p>
        )}
        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span className={`rounded-full px-2 py-0.5 ring-1 ${BADGE[todo.priority]}`}>{todo.priority}</span>
          <time dateTime={new Date(todo.createdAt).toISOString()}>{formatTime(todo.createdAt)}</time>
        </p>
      </div>

      {!isEditing && (
        <div className="flex gap-1 text-sm sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          <button onClick={startEdit} className="focus-ring rounded-md px-2 py-1 text-indigo-300 hover:bg-indigo-500/15">Edit</button>
          <button onClick={handleDelete} className="focus-ring rounded-md px-2 py-1 text-rose-300 hover:bg-rose-500/15">Delete</button>
        </div>
      )}
    </li>
  );
}
