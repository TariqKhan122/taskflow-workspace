import { useState } from "react";
import QuizSummary from "./QuizSummary";
import { QUESTIONS } from "../data/questions";
import type { QuizState } from "../types";

export default function Quiz() {
  // Rules of Hooks: hooks run BEFORE the early return below. Returning first would
  // change the hook count between renders. Every setQuiz call re-renders Quiz.
  const [quiz, setQuiz] = useState<QuizState>({ answers: [], selected: null });

  // ---- Derived state: no separate index/score/progress in useState ----
  const total = QUESTIONS.length;
  const index = quiz.answers.length; // next unanswered question
  const score = quiz.answers.filter((a, i) => a === QUESTIONS[i].answerIndex).length;
  const progress = Math.round((index / total) * 100);

  const restart = () => setQuiz({ answers: [], selected: null });

  // Conditional rendering #3 — early return: finished quiz renders the summary instead
  if (index === total) return <QuizSummary answers={quiz.answers} score={score} onRestart={restart} />;

  const question = QUESTIONS[index];
  const answered = quiz.selected !== null;
  const isCorrect = quiz.selected === question.answerIndex;

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>, choice: number) => {
    e.currentTarget.blur();
    // Functional + immutable: new object via spread; ignore clicks once answered
    setQuiz((prev) => (prev.selected !== null ? prev : { ...prev, selected: choice }));
  };

  const handleNext = () =>
    setQuiz((prev) => (prev.selected === null ? prev : { answers: [...prev.answers, prev.selected], selected: null }));

  const optionStyle = (i: number): string => {
    if (!answered) return "border-white/10 hover:border-indigo-400/60 hover:bg-white/5";
    if (i === question.answerIndex) return "border-emerald-400 bg-emerald-500/15 text-emerald-200";
    if (i === quiz.selected) return "border-rose-400 bg-rose-500/15 text-rose-200";
    return "border-white/10 opacity-40";
  };

  return (
    <div className="glass p-6 sm:p-8">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-semibold text-indigo-200">{question.category}</span>
        <span>Question {index + 1} of {total} · Score {score}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Quiz progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold leading-snug">{question.prompt}</h2>

      <div className="mt-5 space-y-2">
        {question.options.map((option, i) => (
          <button
            key={option}
            onClick={(e) => handleSelect(e, i)}
            aria-disabled={answered}
            className={`focus-ring flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${optionStyle(i)}`}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/10 text-xs font-semibold">{String.fromCharCode(65 + i)}</span>
            {option}
          </button>
        ))}
      </div>

      {/* && — feedback + explanation appear only after answering */}
      {answered && (
        <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${isCorrect ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
          <strong>{isCorrect ? "Correct. " : "Not quite. "}</strong>{question.explanation}
        </p>
      )}

      <button
        onClick={handleNext}
        disabled={!answered}
        className="focus-ring mt-6 w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
      >
        {index === total - 1 ? "See results" : "Next question"}
      </button>
    </div>
  );
}
