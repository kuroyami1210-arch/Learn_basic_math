import { useState } from 'react';
import { sound } from '../utils/sound';

interface MentalMathTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MathTrick {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  formula: string;
  steps: string[];
  example: {
    question: string;
    breakdown: string;
    answer: string;
  };
  practiceQuestion: string;
  practiceAnswer: number;
}

const TRICKS: MathTrick[] = [
  {
    id: 'perkalian-11',
    title: 'Perkalian 11 Instan (2 Digit)',
    category: 'Spesifik',
    tag: 'Sangat Cepat',
    description: 'Untuk mengalikan bilangan 2 digit dengan 11, cukup renggangkan digitnya lalu sisipkan jumlah kedua digit tersebut di tengah.',
    formula: 'AB × 11 = A (A+B) B',
    steps: [
      'Pisahkan digit puluhan dan satuan: misal 35 → 3 dan 5',
      'Jumlahkan kedua digit: 3 + 5 = 8',
      'Sisipkan di tengah: 3 [8] 5 → 385.',
      'Catatan: Jika jumlahnya ≥ 10 (misal 85: 8+5=13), simpan 1 ke angka depan: (8+1) [3] 5 = 935.',
    ],
    example: {
      question: '43 × 11',
      breakdown: '4 + 3 = 7, sisipkan di tengah 4 dan 3',
      answer: '473',
    },
    practiceQuestion: '52 × 11',
    practiceAnswer: 572,
  },
  {
    id: 'kuadrat-akhiran-5',
    title: 'Kuadrat Angka Berakhiran 5',
    category: 'Kuadrat',
    tag: 'Klasik',
    description: 'Setiap bilangan yang berakhiran 5 bila dikuadratkan, dua angka terakhirnya pasti 25, dan angka depannya adalah n × (n + 1).',
    formula: '(n5)² = [n × (n + 1)] 25',
    steps: [
      'Ambil angka selain angka 5 (sebut n): misal 65 → n = 6',
      'Kalikan n dengan kakaknya (n + 1): 6 × 7 = 42',
      'Tempelkan 25 di belakangnya: 4225.',
    ],
    example: {
      question: '75 × 75',
      breakdown: '7 × (7 + 1) = 7 × 8 = 56, lalu tempel 25',
      answer: '5625',
    },
    practiceQuestion: '35 × 35',
    practiceAnswer: 1225,
  },
  {
    id: 'perkalian-9',
    title: 'Trik Perkalian 9 & 99',
    category: 'Substitusi',
    tag: 'Praktis',
    description: 'Ubah angka 9 menjadi (10 − 1) atau 99 menjadi (100 − 1), lalu gunakan sifat distributif.',
    formula: 'X × 9 = (X × 10) − X | X × 99 = (X × 100) − X',
    steps: [
      'Kalikan bilangan dengan 10 (tambahkan nol di belakang).',
      'Kurangkan hasilnya dengan bilangan aslinya.',
      'Contoh 48 × 9: (48 × 10) − 48 = 480 − 48 = 432.',
    ],
    example: {
      question: '64 × 9',
      breakdown: '640 − 64 = 640 − 60 − 4 = 580 − 4',
      answer: '576',
    },
    practiceQuestion: '27 × 9',
    practiceAnswer: 243,
  },
  {
    id: 'perkalian-5',
    title: 'Trik Kali 5 (Bagi 2 lalu Kali 10)',
    category: 'Substitusi',
    tag: 'Efisien',
    description: 'Karena 5 adalah 10 ÷ 2, mengalikan dengan 5 sama persis dengan membagi dua lalu menambahkan nol di belakangnya.',
    formula: 'X × 5 = (X ÷ 2) × 10',
    steps: [
      'Bagi bilangan dengan 2 terlebih dahulu.',
      'Kalikan dengan 10 (geser koma 1 digit atau tambah 0).',
      'Contoh 86 × 5: 86 ÷ 2 = 43 → 430.',
    ],
    example: {
      question: '48 × 5',
      breakdown: '48 ÷ 2 = 24, lalu kali 10',
      answer: '240',
    },
    practiceQuestion: '74 × 5',
    practiceAnswer: 370,
  },
  {
    id: 'pecah-puluhan',
    title: 'Metode Pecah Puluhan (Distributif)',
    category: 'Universal',
    tag: 'Fundamental',
    description: 'Trik paling serbaguna untuk menghitung perkalian 2-digit atau 3-digit langsung di kepala.',
    formula: 'A × (B + C) = (A × B) + (A × C)',
    steps: [
      'Pecah angka rumit menjadi puluhan bulat dan satuan: misal 47 × 6 → (40 × 6) + (7 × 6)',
      'Hitung perkalian puluhan: 40 × 6 = 240',
      'Hitung perkalian satuan: 7 × 6 = 42',
      'Jumlahkan kedua hasil: 240 + 42 = 282.',
    ],
    example: {
      question: '36 × 4',
      breakdown: '(30 × 4) + (6 × 4) = 120 + 24',
      answer: '144',
    },
    practiceQuestion: '28 × 7',
    practiceAnswer: 196,
  },
];

export function MentalMathTipsModal({ isOpen, onClose }: MentalMathTipsModalProps) {
  const [selectedTrickId, setSelectedTrickId] = useState<string>(TRICKS[0].id);
  const [testInput, setTestInput] = useState<string>('');
  const [testFeedback, setTestFeedback] = useState<'correct' | 'wrong' | null>(null);

  if (!isOpen) return null;

  const currentTrick = TRICKS.find((t) => t.id === selectedTrickId) || TRICKS[0];

  const handleTestCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(testInput.trim(), 10);
    if (val === currentTrick.practiceAnswer) {
      sound.playCorrect(2);
      setTestFeedback('correct');
    } else {
      sound.playWrong();
      setTestFeedback('wrong');
    }
  };

  const handleSelectTrick = (id: string) => {
    sound.playClick();
    setSelectedTrickId(id);
    setTestInput('');
    setTestFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0f1728] border border-[#1b263e] rounded-2xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b263e] bg-[#0c1322]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#5b8bf7] font-semibold block">
              DOKUMENTASI TEKNIK
            </span>
            <h2 className="text-lg font-bold text-white">
              Panduan Trik Kalkulasi Mental
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#162136] hover:bg-[#1f2e4c] border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Navigation */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#1b263e] p-4 space-y-2 bg-[#0a101d] overflow-y-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1 pb-1">
              Daftar Metode
            </span>
            {TRICKS.map((trick, idx) => {
              const active = trick.id === selectedTrickId;
              return (
                <button
                  key={trick.id}
                  onClick={() => handleSelectTrick(trick.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'border-[#5b8bf7] bg-[#5b8bf7]/15 text-[#5b8bf7] font-bold'
                      : 'border-[#1b263e] bg-[#0f1728] text-slate-300 hover:bg-[#162136]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{idx + 1}. {trick.title}</span>
                    <span className="text-[10px] text-slate-400">{trick.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6">
            <div>
              <div className="text-xs font-semibold text-[#5b8bf7] mb-1">
                Kategori: {currentTrick.category} · {currentTrick.tag}
              </div>
              <h3 className="text-xl font-bold text-white">
                {currentTrick.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {currentTrick.description}
              </p>
            </div>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-[#0a101d] border border-[#1b263e]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Rumus Dasar:
              </span>
              <div className="text-base font-mono font-bold text-[#5b8bf7]">
                {currentTrick.formula}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 block">
                Langkah Eksekusi:
              </span>
              <div className="space-y-1.5">
                {currentTrick.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-[#1b263e] bg-[#0c1322] text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span className="font-bold text-[#5b8bf7] shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example */}
            <div className="p-4 rounded-xl border border-[#1b263e] bg-[#0a101d] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Contoh:
              </span>
              <div className="text-sm font-bold font-mono text-white">
                {currentTrick.example.question} = {currentTrick.example.answer}
              </div>
              <p className="text-xs text-slate-400">
                Langkah: {currentTrick.example.breakdown}
              </p>
            </div>

            {/* Interactive Mini Test */}
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-200">
                  Uji Coba di Kepala:
                </span>
                <span className="font-bold font-mono text-white text-sm">
                  {currentTrick.practiceQuestion} = ?
                </span>
              </div>

              <form onSubmit={handleTestCheck} className="flex gap-2">
                <input
                  type="number"
                  placeholder="Ketik jawaban..."
                  value={testInput}
                  onChange={(e) => {
                    setTestInput(e.target.value);
                    setTestFeedback(null);
                  }}
                  className="flex-1 bg-[#0a101d] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#5b8bf7] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#5b8bf7] hover:bg-[#4d7ef2] text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Cek
                </button>
              </form>

              {testFeedback === 'correct' && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/40">
                  ✓ Benar! Jawaban tepat {currentTrick.practiceAnswer}.
                </div>
              )}
              {testFeedback === 'wrong' && (
                <div className="text-xs font-bold text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/40">
                  ✗ Belum tepat. Jawaban yang benar adalah {currentTrick.practiceAnswer}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1b263e] bg-[#0c1322] flex items-center justify-between text-xs text-slate-400">
          <span>Latihan rutin akan membentuk intuisi berhitung tanpa alat bantu.</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#162136] hover:bg-[#1f2e4c] border border-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
