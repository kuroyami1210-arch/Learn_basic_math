import { GameResult, GameSettings, QuickPreset } from '../types/math';

const STORAGE_KEYS = {
  SETTINGS: 'matematika_kilat_settings',
  HISTORY: 'matematika_kilat_history',
  STATS: 'matematika_kilat_stats',
};

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'challenge',
  operations: ['multiply'],
  numOperands: 2,
  operands: [
    { scale: 'puluhan', min: 10, max: 99, label: 'Angka Pertama' },
    { scale: 'satuan', min: 2, max: 9, label: 'Angka Kedua' },
  ],
  questionCount: 10,
  timerType: 'per-question',
  timeLimitSeconds: 7, // 7 seconds per question by default in challenge mode
  lives: 3,
  allowNegative: false,
};

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'perkalian-dasar-10',
    title: 'Tabel Perkalian Dasar (1-10)',
    description: 'Cocok untuk pemanasan atau melancarkan hafalan tabel perkalian 1 sampai 10.',
    iconName: 'Zap',
    badge: 'Pemula',
    settings: {
      mode: 'challenge',
      operations: ['multiply'],
      numOperands: 2,
      operands: [
        { scale: 'satuan', min: 2, max: 10, label: 'Angka Pertama' },
        { scale: 'satuan', min: 2, max: 10, label: 'Angka Kedua' },
      ],
      questionCount: 10,
      timerType: 'per-question',
      timeLimitSeconds: 5,
      lives: 3,
    },
  },
  {
    id: 'puluhan-x-satuan',
    title: 'Puluhan × Satuan (2-Digit × 1-Digit)',
    description: 'Pondasi penting perkalian mental: latih pemecahan angka puluhan dan satuan secara cepat.',
    iconName: 'Flame',
    badge: 'Menengah',
    settings: {
      mode: 'challenge',
      operations: ['multiply'],
      numOperands: 2,
      operands: [
        { scale: 'puluhan', min: 12, max: 99, label: 'Angka Pertama' },
        { scale: 'satuan', min: 2, max: 9, label: 'Angka Kedua' },
      ],
      questionCount: 10,
      timerType: 'per-question',
      timeLimitSeconds: 8,
      lives: 3,
    },
  },
  {
    id: 'ratusan-x-satuan',
    title: 'Ratusan × Satuan (3-Digit × 1-Digit)',
    description: 'Tingkatkan kapasitas memori kerja dengan mengalikan ratusan secara instan.',
    iconName: 'Target',
    badge: 'Tantangan',
    settings: {
      mode: 'challenge',
      operations: ['multiply'],
      numOperands: 2,
      operands: [
        { scale: 'ratusan', min: 100, max: 999, label: 'Angka Pertama' },
        { scale: 'satuan', min: 2, max: 9, label: 'Angka Kedua' },
      ],
      questionCount: 10,
      timerType: 'per-question',
      timeLimitSeconds: 10,
      lives: 3,
    },
  },
  {
    id: 'ratusan-x-puluhan',
    title: 'Ratusan × Puluhan (3-Digit × 2-Digit)',
    description: 'Level master kalkulator manusia: angka pertama ratusan dan angka kedua puluhan.',
    iconName: 'Sparkles',
    badge: 'Master',
    settings: {
      mode: 'challenge',
      operations: ['multiply'],
      numOperands: 2,
      operands: [
        { scale: 'ratusan', min: 100, max: 500, label: 'Angka Pertama' },
        { scale: 'puluhan', min: 11, max: 50, label: 'Angka Kedua' },
      ],
      questionCount: 5,
      timerType: 'per-question',
      timeLimitSeconds: 20,
      lives: 3,
    },
  },
  {
    id: 'latihan-santai',
    title: 'Mode Latihan Santai (Stopwatch)',
    description: 'Tanpa tekanan timer mundur. Asah teknik berhitung sambil melihat penjelasan trik jika butuh.',
    iconName: 'BookOpen',
    badge: 'Santai',
    settings: {
      mode: 'practice',
      operations: ['multiply'],
      numOperands: 2,
      operands: [
        { scale: 'puluhan', min: 10, max: 99, label: 'Angka Pertama' },
        { scale: 'satuan', min: 2, max: 9, label: 'Angka Kedua' },
      ],
      questionCount: 10,
      timerType: 'stopwatch',
      timeLimitSeconds: 0,
      lives: 0,
    },
  },
  {
    id: 'aritmatika-campuran',
    title: 'Aritmatika Campuran (+, −, ×, ÷)',
    description: 'Uji fleksibilitas otak dengan kombinasi 4 operasi matematika dasar bergantian.',
    iconName: 'Shuffle',
    badge: 'Campuran',
    settings: {
      mode: 'challenge',
      operations: ['multiply', 'add', 'subtract', 'divide'],
      numOperands: 2,
      operands: [
        { scale: 'puluhan', min: 10, max: 99, label: 'Angka Pertama' },
        { scale: 'puluhan', min: 2, max: 50, label: 'Angka Kedua' },
      ],
      questionCount: 15,
      timerType: 'per-question',
      timeLimitSeconds: 8,
      lives: 3,
    },
  },
];

export function loadSavedSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadGameHistory(): GameResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveGameResult(result: GameResult) {
  try {
    const history = loadGameHistory();
    history.unshift(result);
    // Keep max 30 recent results
    const trimmed = history.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function clearGameHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch {
    // ignore
  }
}
