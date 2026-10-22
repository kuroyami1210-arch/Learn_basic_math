import { GameMode, QuickPreset } from '../types/math';
import { sound } from '../utils/sound';

interface HomeScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onSelectPreset: (preset: QuickPreset) => void;
  onOpenTips: () => void;
  onOpenHistory: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function HomeScreen({
  onSelectMode,
  onOpenTips,
  onOpenHistory,
  isMuted,
  onToggleMute,
}: HomeScreenProps) {
  const samplePills = [
    { label: '7 × 8', mode: 'multiply' },
    { label: '56 ÷ 7', mode: 'divide' },
    { label: '348 × 27', mode: 'multiply' },
    { label: '905 − 478', mode: 'subtract' },
    { label: '64 + 39', mode: 'add' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12 animate-fade-in">
      {/* Top Bar - Clean & Matches Screenshot */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f87171] text-slate-950 flex items-center justify-center font-bold text-lg leading-none select-none shadow-sm">
            ×
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            Kali Cepat
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download ZIP Button */}
          <a
            href="/kali-cepat-source-code.zip"
            download="kali-cepat-source-code.zip"
            className="px-3.5 py-1.5 rounded-lg bg-[#162136] hover:bg-[#1f2d48] border border-blue-900/50 hover:border-blue-500 text-blue-300 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5"
            title="Unduh seluruh source code dalam file .zip"
          >
            <span>Unduh ZIP</span>
            <span className="text-[10px] text-blue-400 font-mono">↓</span>
          </a>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTips();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1a2337] border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Trik Cepat
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHistory();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1a2337] border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Riwayat
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1a2337] border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            {isMuted ? 'Mute' : 'Audio On'}
          </button>
        </div>
      </header>

      {/* Hero Centerpiece - Matches Screenshot 75 */}
      <div className="text-center space-y-6 pt-2 max-w-2xl mx-auto">
        {/* Brand Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141d2e] border border-slate-800/90 shadow-sm">
          <div className="w-5 h-5 rounded-md bg-[#f87171] text-slate-950 flex items-center justify-center font-bold text-xs">
            ×
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Kali Cepat
          </span>
        </div>

        {/* Big Dual-Tone Headline */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Hitung lebih cepat,
          </h1>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#f87171]">
            soal demi soal.
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
          Atur sendiri operasi, besar angka, jumlah soal, dan batas waktunya.
          Jawabanmu diketik langsung, bukan pilihan ganda.
        </p>

        {/* Sample Question Pills Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {samplePills.map((pill, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-full bg-[#111929] border border-[#1e2a44] text-slate-300 font-mono text-xs font-semibold shadow-inner"
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* The 2 Mode Cards - Exact Replica of Screenshot 75 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {/* Latihan Card (Dark) */}
        <div className="p-6 rounded-2xl bg-[#0d1526] border border-[#1b263e] flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-700 transition-colors">
          <div className="space-y-4">
            {/* Circle Stopwatch Icon Glyph */}
            <div className="w-10 h-10 rounded-full bg-[#162136] text-blue-300 border border-blue-900/40 flex items-center justify-center font-mono text-sm font-bold">
              ⏱
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Latihan
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Stopwatch berjalan naik. Cocok untuk membangun ritme tanpa tekanan.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('practice');
            }}
            className="text-left text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1.5 pt-2"
          >
            <span>Atur soal</span>
            <span>→</span>
          </button>
        </div>

        {/* Tantangan Card (Bright Periwinkle Blue) */}
        <div className="p-6 rounded-2xl bg-[#5b8bf7] text-slate-950 flex flex-col justify-between space-y-6 shadow-xl shadow-blue-500/10 hover:bg-[#4f80f3] transition-colors">
          <div className="space-y-4">
            {/* Rounded Hourglass Icon Glyph */}
            <div className="w-10 h-10 rounded-xl bg-white/25 text-slate-950 border border-black/10 flex items-center justify-center font-mono text-sm font-bold">
              ⏳
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Tantangan
              </h3>
              <p className="text-xs sm:text-sm text-slate-900/85 leading-relaxed font-medium">
                Setiap soal punya timer hitung mundur. Waktu habis, soal dianggap salah.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('challenge');
            }}
            className="text-left text-sm font-bold text-slate-950 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 pt-2"
          >
            <span>Atur soal</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
