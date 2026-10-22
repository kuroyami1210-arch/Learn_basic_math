import { useState } from 'react';
import { GameMode, GameSettings, MathOperation, DigitScalePreset } from '../types/math';
import { sound } from '../utils/sound';

interface SetupScreenProps {
  initialSettings: GameSettings;
  onStartGame: (settings: GameSettings) => void;
  onBack: () => void;
}

const DIGIT_PRESETS: { id: DigitScalePreset; title: string; subtitle: string; min: number; max: number }[] = [
  { id: 'satuan', title: 'Satuan', subtitle: '1 digit', min: 2, max: 9 },
  { id: 'puluhan', title: 'Puluhan', subtitle: '2 digit', min: 10, max: 99 },
  { id: 'ratusan', title: 'Ratusan', subtitle: '3 digit', min: 100, max: 999 },
];

const OPERATION_BUTTONS: { op: MathOperation; symbol: string; label: string }[] = [
  { op: 'multiply', symbol: '×', label: 'Kali' },
  { op: 'divide', symbol: '÷', label: 'Bagi' },
  { op: 'add', symbol: '+', label: 'Tambah' },
  { op: 'subtract', symbol: '−', label: 'Kurang' },
];

export function SetupScreen({ initialSettings, onStartGame, onBack }: SetupScreenProps) {
  const [settings, setSettings] = useState<GameSettings>({ ...initialSettings });
  const [sampleSeed, setSampleSeed] = useState<number>(1);

  const isChallenge = settings.mode === 'challenge';

  const handleToggleOperation = (op: MathOperation) => {
    sound.playClick();
    setSettings((prev) => {
      const exists = prev.operations.includes(op);
      if (exists && prev.operations.length === 1) return prev;
      const updated = exists
        ? prev.operations.filter((o) => o !== op)
        : [...prev.operations, op];
      return { ...prev, operations: updated };
    });
  };

  const handleScaleChange = (index: number, scale: DigitScalePreset) => {
    sound.playClick();
    const opt = DIGIT_PRESETS.find((d) => d.id === scale) || DIGIT_PRESETS[0];
    setSettings((prev) => {
      const newOperands = [...prev.operands];
      newOperands[index] = {
        ...newOperands[index],
        scale,
        min: opt.min,
        max: opt.max,
      };
      return { ...prev, operands: newOperands };
    });
  };

  // Generate a live sample question for the top preview card
  const op1Scale = settings.operands[0]?.scale || 'puluhan';
  const op2Scale = settings.operands[1]?.scale || 'satuan';

  const getSampleNumber = (scale: DigitScalePreset, seedOffset: number) => {
    if (scale === 'satuan') {
      const samples = [7, 8, 6, 9, 4, 3];
      return samples[(sampleSeed + seedOffset) % samples.length];
    }
    if (scale === 'puluhan') {
      const samples = [77, 92, 45, 84, 36, 68];
      return samples[(sampleSeed + seedOffset) % samples.length];
    }
    const samples = [348, 712, 524, 860, 415];
    return samples[(sampleSeed + seedOffset) % samples.length];
  };

  const sampleNum1 = getSampleNumber(op1Scale, 0);
  const sampleNum2 = getSampleNumber(op2Scale, 2);

  const activeOpSymbol = settings.operations.includes('multiply')
    ? '×'
    : settings.operations.includes('divide')
    ? '÷'
    : settings.operations.includes('add')
    ? '+'
    : '−';

  // Summary sentence at the bottom
  const summaryOpText = settings.operations.map((o) =>
    o === 'multiply' ? '×' : o === 'divide' ? '÷' : o === 'add' ? '+' : '−'
  ).join(', ');

  const summaryScaleText = `${settings.operands[0]?.scale} dan ${settings.operands[1]?.scale}`;
  const summaryTimeText = isChallenge ? `${settings.timeLimitSeconds} dtk per soal` : 'stopwatch';
  const summaryLine = `${settings.questionCount === -1 ? 'Bebas' : settings.questionCount} soal · ${summaryOpText} · ${summaryScaleText} · ${summaryTimeText}`;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>‹</span>
          <span>Kembali</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isChallenge ? 'Atur tantanganmu' : 'Atur latihanmu'}
        </h1>

        <div className="w-12" />
      </div>

      {/* Card 1: CONTOH SOAL (Matches Screenshot 76) */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-[#1b263e] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            CONTOH SOAL
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setSampleSeed((prev) => prev + 1);
            }}
            className="px-3 py-1 rounded-lg bg-[#162136] hover:bg-[#1f2e4c] border border-slate-700/60 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>↻</span>
            <span>Lain</span>
          </button>
        </div>

        <div className="py-2 text-center">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-4">
            <span>{sampleNum1}</span>
            <span className="text-[#f87171]">{activeOpSymbol}</span>
            <span>{sampleNum2}</span>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0f1728] border border-[#1b263e] shadow-xl space-y-6">
        {/* Section 1: Operasi hitung */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Operasi hitung
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih satu atau lebih. Jenis soal dicampur secara acak.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {OPERATION_BUTTONS.map((item) => {
              const active = settings.operations.includes(item.op);
              return (
                <button
                  key={item.op}
                  type="button"
                  onClick={() => handleToggleOperation(item.op)}
                  className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#5b8bf7] border-[#5b8bf7] text-slate-950 font-bold shadow-md shadow-blue-500/20'
                      : 'bg-[#0a101d] border-[#1b263e] text-slate-300 hover:bg-[#121c30]'
                  }`}
                >
                  <span className="text-xl font-mono leading-none">{item.symbol}</span>
                  <span className="text-xs leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Besar angka */}
        <div className="space-y-4 pt-2 border-t border-[#1b263e]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Besar angka
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Atur angka pertama dan kedua secara terpisah, misalnya ratusan dikali puluhan.
            </p>
          </div>

          {/* Angka pertama */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">
              Angka pertama
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#0a101d] border border-[#1b263e]">
              {DIGIT_PRESETS.map((opt) => {
                const active = settings.operands[0]?.scale === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleScaleChange(0, opt.id)}
                    className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-[#5b8bf7] text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.title}</div>
                    <div className="text-[10px] opacity-75">{opt.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Angka kedua */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">
              Angka kedua
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#0a101d] border border-[#1b263e]">
              {DIGIT_PRESETS.map((opt) => {
                const active = settings.operands[1]?.scale === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleScaleChange(1, opt.id)}
                    className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-[#5b8bf7] text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.title}</div>
                    <div className="text-[10px] opacity-75">{opt.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Jumlah soal */}
        <div className="space-y-3 pt-2 border-t border-[#1b263e]">
          <h3 className="text-base font-bold text-white tracking-tight">
            Jumlah soal
          </h3>

          <div className="grid grid-cols-6 gap-2">
            {[5, 10, 20, 30, 50, -1].map((count) => {
              const active = settings.questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSettings((prev) => ({ ...prev, questionCount: count }));
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#5b8bf7] border-[#5b8bf7] text-slate-950 shadow-sm'
                      : 'bg-[#0a101d] border-[#1b263e] text-slate-300 hover:bg-[#121c30]'
                  }`}
                >
                  {count === -1 ? 'Bebas' : `${count}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Batas waktu per soal (Tantangan mode) */}
        {isChallenge && (
          <div className="space-y-3 pt-2 border-t border-[#1b263e]">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Batas waktu per soal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Soal otomatis dianggap salah saat hitungan mundur habis.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[3, 5, 7, 10, 15, 20].map((sec) => {
                const active = settings.timeLimitSeconds === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSettings((prev) => ({ ...prev, timeLimitSeconds: sec }));
                    }}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#5b8bf7] border-[#5b8bf7] text-slate-950 shadow-sm'
                        : 'bg-[#0a101d] border-[#1b263e] text-slate-300 hover:bg-[#121c30]'
                    }`}
                  >
                    {sec} dtk
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky / Floating Bottom Summary Bar (Exact Match Screenshot 76) */}
      <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-[#1b263e] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-300 font-medium pl-1">
          {summaryLine}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onStartGame(settings);
          }}
          className="py-3 px-6 rounded-xl bg-[#5b8bf7] hover:bg-[#4d7ef2] text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/20 cursor-pointer text-center"
        >
          {isChallenge ? 'Mulai tantangan' : 'Mulai latihan'}
        </button>
      </div>
    </div>
  );
}
