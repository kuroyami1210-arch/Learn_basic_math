export type GameMode = 'practice' | 'challenge';

export type MathOperation = 'multiply' | 'add' | 'subtract' | 'divide';

export type DigitScalePreset = 'satuan' | 'puluhan-kecil' | 'puluhan' | 'ratusan' | 'ribuan' | 'custom';

export interface OperandConfig {
  scale: DigitScalePreset;
  min: number;
  max: number;
  label?: string;
}

export type TimerType = 'per-question' | 'total-time' | 'stopwatch';

export interface GameSettings {
  mode: GameMode;
  operations: MathOperation[];
  numOperands: 2 | 3; // 2 angka atau 3 angka
  operands: OperandConfig[]; // Config untuk angka pertama, kedua, (ketiga jika 3 angka)
  questionCount: number; // e.g. 5, 10, 20, 50, or -1 for endless
  timerType: TimerType;
  timeLimitSeconds: number; // For per-question: e.g. 5s; for total-time: e.g. 60s; 0 for stopwatch
  lives: number; // 3, 5, or 0 (unlimited)
  allowNegative: boolean; // For subtraction
}

export interface MathQuestion {
  id: string;
  numbers: number[];
  operations: MathOperation[];
  expressionDisplay: string;
  correctAnswer: number;
  explanation?: string;
}

export interface QuestionRecord {
  question: MathQuestion;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface GameResult {
  id: string;
  date: string;
  mode: GameMode;
  settingsSummary: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  fastestTimeSeconds: number;
  score: number;
  maxStreak: number;
  records: QuestionRecord[];
}

export interface QuickPreset {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  badge: string;
  settings: Partial<GameSettings>;
}
