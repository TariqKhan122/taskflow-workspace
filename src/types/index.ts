// Central place for every shared type, so components stay strictly typed.
export type Priority = "Low" | "Medium" | "High";
export type FilterType = "all" | "active" | "completed";
export type Tab = "tasks" | "quiz";
export type Category = "React" | "TypeScript" | "Hooks" | "Events";

export interface Todo {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: number; // epoch ms; formatted only when rendered
}

export interface Question {
  id: number;
  category: Category;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

// One object holds the quiz's state, so related values always update together.
export interface QuizState {
  answers: number[];         // chosen option index for each answered question
  selected: number | null;   // pick for the current question, before "Next"
}
