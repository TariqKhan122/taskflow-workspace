import { useState } from "react";
import TaskManager from "./components/TaskManager";
import Quiz from "./components/Quiz";
import type { Tab } from "./types";

const TABS: { id: Tab; label: string }[] = [
  { id: "tasks", label: "Task manager" },
  { id: "quiz", label: "Technical quiz" },
];

export default function App() {
  // Changing `tab` re-renders App; the two modules below stay mounted (hidden),
  // so their own state survives a tab switch.
  const [tab, setTab] = useState<Tab>("tasks");

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-14">
      <header>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">TaskFlow Workspace</h1>
        <p className="mt-2 text-slate-400">Plan your work, then test what you know about React and TypeScript.</p>
      </header>

      <nav role="tablist" className="glass mt-6 grid grid-cols-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); setTab(t.id); }}
            className={`focus-ring rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="mt-6" hidden={tab !== "tasks"}><TaskManager /></section>
      <section className="mt-6" hidden={tab !== "quiz"}><Quiz /></section>
    </main>
  );
}
