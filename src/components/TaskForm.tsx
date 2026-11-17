import { useState } from "react";
import type { Priority } from "../types";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

interface TaskFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  // Form-local state lives here, so typing re-renders only this form,
  // not the whole task list. (Re-renders are triggered by these setters.)
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const canSubmit = text.trim().length > 0; // derived, not stored

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's page reload
    if (!canSubmit) return;
    onAdd(text.trim(), priority);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-4">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={handleText}
          placeholder="Add a task…"
          aria-label="Task description"
          className="focus-ring min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring rounded-xl bg-indigo-500 px-5 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm" role="group" aria-label="Priority">
        <span className="text-slate-400">Priority</span>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={priority === p}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); setPriority(p); }}
            className={`focus-ring rounded-full border px-3 py-1 transition ${
              priority === p ? "border-indigo-400 bg-indigo-500/20 text-indigo-200" : "border-white/10 text-slate-400 hover:border-white/30"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </form>
  );
}
