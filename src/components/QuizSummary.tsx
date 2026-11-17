import { QUESTIONS } from "../data/questions";

interface QuizSummaryProps {
  answers: number[];
  score: number;
  onRestart: () => void;
}

const tierFor = (percent: number): string =>
  percent >= 90 ? "Expert" : percent >= 70 ? "Proficient" : percent >= 50 ? "Developing" : "Foundations";

export default function QuizSummary({ answers, score, onRestart }: QuizSummaryProps) {
  const percent = Math.round((score / QUESTIONS.length) * 100); // derived accuracy

  return (
    <div className="space-y-4">
      <div className="glass p-8 text-center">
        <p className="font-display text-6xl font-extrabold text-indigo-300">{percent}%</p>
        <p className="mt-2 font-display text-2xl font-semibold">{tierFor(percent)}</p>
        <p className="mt-1 text-slate-400">{score} of {QUESTIONS.length} correct</p>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); onRestart(); }}
          className="focus-ring mt-6 rounded-xl bg-indigo-500 px-5 py-3 font-semibold transition hover:bg-indigo-400"
        >
          Restart quiz
        </button>
      </div>

      <ol className="space-y-2">
        {QUESTIONS.map((q, i) => {
          const correct = answers[i] === q.answerIndex;
          return (
            <li key={q.id} className="glass p-4 text-sm">
              <p className="flex items-start gap-2 font-semibold">
                <span className={correct ? "text-emerald-400" : "text-rose-400"} aria-label={correct ? "Correct" : "Incorrect"}>{correct ? "✓" : "✗"}</span>
                {q.prompt}
              </p>
              <p className="mt-1 pl-6 text-slate-400">
                You chose: <span className={correct ? "text-emerald-300" : "text-rose-300"}>{q.options[answers[i]]}</span>
              </p>
              {/* && — show the right answer only when the user missed it */}
              {!correct && <p className="pl-6 text-slate-400">Answer: <span className="text-emerald-300">{q.options[q.answerIndex]}</span></p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
