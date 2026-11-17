interface StatsBarProps {
  total: number;
  active: number;
  completed: number;
  percent: number;
}

// Pure presentational component: re-renders only when TaskManager passes new props.
export default function StatsBar({ total, active, completed, percent }: StatsBarProps) {
  const stats = [
    { label: "Total", value: total },
    { label: "Active", value: active },
    { label: "Completed", value: completed },
  ];
  return (
    <div className="glass p-5">
      <div className="flex items-end justify-between gap-4">
        <dl className="flex gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-3xl font-extrabold tabular-nums">{s.value}</dd>
              <dt className="text-xs text-slate-400">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="font-display text-4xl font-extrabold text-indigo-300 tabular-nums">{percent}%</p>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar" aria-label="Completion" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
