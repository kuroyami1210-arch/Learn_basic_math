import { useState } from 'react';
import { GameResult } from '../types/math';
import { sound } from '../utils/sound';

interface ResultScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onModifySettings: () => void;
  onBackToMenu: () => void;
  onOpenTips: () => void;
}

export function ResultScreen({
  result,
  onPlayAgain,
  onModifySettings,
  onBackToMenu,
  onOpenTips,
}: ResultScreenProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  const filteredRecords = result.records.filter((rec) => {
    if (filterMode === 'correct') return rec.isCorrect;
    if (filterMode === 'wrong') return !rec.isCorrect;
    return true;
  });

  const getRankAssessment = (accuracy: number, avgTime: number) => {
    if (accuracy === 100 && avgTime <= 4) {
      return {
        level: 'MASTER KILAT',
        note: 'Kecepatan dan ketepatan setara standar kalkulasi mental profesional.',
      };
    }
    if (accuracy >= 90) {
      return {
        level: 'SANGAT TINGGI',
        note: 'Konsistensi akurasi terjaga dengan ritme perhitungan stabil.',
      };
    }
    if (accuracy >= 70) {
      return {
        level: 'KOMPETEN',
        note: 'Dasar pemecahan baik. Tingkatkan latihan untuk mempercepat respons.',
      };
    }
    return {
      level: 'PERLU PENGASAHAN',
      note: 'Pelajari trik pemecahan puluhan dan distributif untuk mempermudah hitungan.',
    };
  };

  const rank = getRankAssessment(result.accuracy, result.averageTimePerQuestion);

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1728] border border-[#1b263e] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b263e] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              HASIL EVALUASI SESI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ringkasan Performa
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Predikat</span>
            <span className="text-sm font-bold text-[#5b8bf7] uppercase">
              {rank.level}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {rank.note}
        </p>

        {/* Big Score Readout */}
        <div className="p-4 rounded-xl bg-[#0a101d] border border-[#1b263e] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-400">
            TOTAL SKOR AKHIR:
          </span>
          <span className="text-3xl sm:text-4xl font-black font-mono text-white tabular-nums">
            {result.score.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Numerical Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0f1728] border border-[#1b263e] text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Akurasi
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#5b8bf7] mt-1 font-mono tabular-nums">
            {result.accuracy}%
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {result.correctCount}/{result.totalQuestions} Benar
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1728] border border-[#1b263e] text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Rata-rata Waktu
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono tabular-nums">
            {result.averageTimePerQuestion.toFixed(1)}s
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            per butir soal
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1728] border border-[#1b263e] text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Waktu Tercepat
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono tabular-nums">
            {result.fastestTimeSeconds > 0 ? `${result.fastestTimeSeconds.toFixed(1)}s` : '-'}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            rekor tercepat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1728] border border-[#1b263e] text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Streak Terpanjang
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#f87171] mt-1 font-mono tabular-nums">
            {result.maxStreak}X
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            beruntun benar
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="py-3.5 px-4 rounded-xl bg-[#5b8bf7] hover:bg-[#4d7ef2] text-slate-950 font-bold text-sm tracking-wide transition-colors text-center cursor-pointer shadow-lg shadow-blue-500/15"
        >
          Main Lagi →
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onModifySettings();
          }}
          className="py-3.5 px-4 rounded-xl bg-[#0f1728] border border-[#1b263e] hover:border-slate-600 text-slate-200 font-semibold text-sm transition-colors text-center cursor-pointer"
        >
          Ubah Pengaturan
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="py-3.5 px-4 rounded-xl bg-[#0f1728] border border-[#1b263e] hover:border-slate-600 text-slate-400 hover:text-white font-semibold text-sm transition-colors text-center cursor-pointer"
        >
          Menu Utama
        </button>
      </div>

      {/* Review Soal List */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-[#1b263e] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b263e] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Evaluasi Jawaban ({result.records.length} Soal)
            </h3>
            <span className="text-xs text-slate-400">
              Klik setiap soal untuk melihat langkah triknya
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setFilterMode('all');
              }}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#5b8bf7] text-slate-950 border-[#5b8bf7] font-bold'
                  : 'bg-[#0a101d] text-slate-300 border-[#1b263e]'
              }`}
            >
              Semua ({result.records.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterMode('wrong');
              }}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                filterMode === 'wrong'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                  : 'bg-[#0a101d] text-slate-300 border-[#1b263e]'
              }`}
            >
              Salah ({result.wrongCount})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterMode('correct');
              }}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                filterMode === 'correct'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                  : 'bg-[#0a101d] text-slate-300 border-[#1b263e]'
              }`}
            >
              Benar ({result.correctCount})
            </button>
          </div>
        </div>

        {/* List of Questions */}
        <div className="space-y-2">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Tidak ada data soal untuk kategori ini.
            </div>
          ) : (
            filteredRecords.map((rec, idx) => {
              const isExpanded = expandedQuestionId === rec.question.id;
              return (
                <div
                  key={rec.question.id || idx}
                  className={`rounded-xl border transition-all ${
                    rec.isCorrect
                      ? 'border-[#1b263e] bg-[#0a101d] hover:border-slate-700'
                      : 'border-red-900/40 bg-red-950/15 hover:border-red-600/60'
                  }`}
                >
                  <button
                    onClick={() => {
                      sound.playClick();
                      setExpandedQuestionId(isExpanded ? null : rec.question.id);
                    }}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            rec.isCorrect ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {rec.isCorrect ? '✓ Benar' : '✗ Salah'}
                        </span>
                        <span className="text-sm font-bold font-mono text-white">
                          {rec.question.expressionDisplay} = {rec.question.correctAnswer}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>
                          Jawabanmu:{' '}
                          <strong className={rec.isCorrect ? 'text-white' : 'text-red-400'}>
                            {rec.userAnswer !== null ? rec.userAnswer : 'Waktu Habis'}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>Waktu: {rec.timeSpentSeconds.toFixed(1)}s</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      {isExpanded ? 'Tutup' : 'Lihat Trik'}
                    </div>
                  </button>

                  {/* Expansion Drawer */}
                  {isExpanded && (
                    <div className="p-3 border-t border-[#1b263e] bg-[#0d1526] rounded-b-xl text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-[#5b8bf7] block">
                        Metode Perhitungan Cepat:
                      </span>
                      <p className="leading-relaxed">
                        {rec.question.explanation ||
                          'Pecah angka menjadi puluhan dan satuan untuk kemudahan hitung.'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Guide Banner */}
      <div className="p-4 rounded-2xl bg-[#0f1728] border border-[#1b263e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-white block">
            Ingin Menguasai Trik Rahasia Lainnya?
          </span>
          <span className="text-xs text-slate-400">
            Pelajari trik perkalian 11, perkalian 9, kuadrat akhiran 5, dan pemecahan distributif.
          </span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onOpenTips();
          }}
          className="px-4 py-2 rounded-xl bg-[#162136] hover:bg-[#1f2e4c] border border-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
        >
          Buka Panduan Trik
        </button>
      </div>
    </div>
  );
}
