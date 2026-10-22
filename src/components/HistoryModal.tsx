import { GameResult } from '../types/math';
import { sound } from '../utils/sound';

interface HistoryModalProps {
  isOpen: boolean;
  history: GameResult[];
  onClose: () => void;
  onClearHistory: () => void;
}

export function HistoryModal({ isOpen, history, onClose, onClearHistory }: HistoryModalProps) {
  if (!isOpen) return null;

  const totalGames = history.length;
  const bestScore = history.reduce((max, h) => Math.max(max, h.score), 0);
  const totalCorrect = history.reduce((acc, h) => acc + h.correctCount, 0);
  const totalQuestions = history.reduce((acc, h) => acc + h.totalQuestions, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const fastestOverall = history.reduce((min, h) => {
    if (h.fastestTimeSeconds > 0) {
      return min === 0 ? h.fastestTimeSeconds : Math.min(min, h.fastestTimeSeconds);
    }
    return min;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0f1728] border border-[#1b263e] rounded-2xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b263e] bg-[#0c1322]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              LOG DATA ARITMATIKA
            </span>
            <h2 className="text-lg font-bold text-white">
              Statistik & Riwayat Sesi
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

        {/* Lifetime Summary Cards */}
        <div className="p-6 border-b border-[#1b263e] grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a101d]">
          <div className="p-3.5 rounded-xl border border-[#1b263e] bg-[#0f1728]">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Total Sesi
            </span>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">
              {totalGames}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-[#1b263e] bg-[#0f1728]">
            <span className="text-[10px] font-bold text-[#5b8bf7] uppercase block">
              Skor Terbaik
            </span>
            <div className="text-2xl font-black text-[#5b8bf7] mt-1 font-mono tabular-nums">
              {bestScore.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-[#1b263e] bg-[#0f1728]">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Akurasi Rata-rata
            </span>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">
              {overallAccuracy}%
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-[#1b263e] bg-[#0f1728]">
            <span className="text-[10px] font-bold text-[#f87171] uppercase block">
              Waktu Tercepat
            </span>
            <div className="text-2xl font-black text-[#f87171] mt-1 font-mono tabular-nums">
              {fastestOverall > 0 ? `${fastestOverall.toFixed(1)}s` : '-'}
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 min-h-0">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Belum ada data sesi latihan yang tersimpan.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-[#1b263e] bg-[#0a101d] hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        item.mode === 'challenge' ? 'text-[#f87171]' : 'text-[#5b8bf7]'
                      }`}
                    >
                      {item.mode === 'challenge' ? 'Tantangan' : 'Latihan'}
                    </span>
                    <span className="text-slate-500 font-normal">{item.date}</span>
                  </div>
                  <div className="font-semibold text-white">
                    {item.settingsSummary}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono border-t sm:border-t-0 border-[#1b263e] pt-2 sm:pt-0">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">AKURASI</span>
                    <span className="font-bold text-white">
                      {item.correctCount}/{item.totalQuestions} ({item.accuracy}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">RATA-RATA</span>
                    <span className="font-bold text-white">
                      {item.averageTimePerQuestion.toFixed(1)}s
                    </span>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <span className="text-slate-500 block text-[10px] uppercase">SKOR</span>
                    <span className="font-bold text-[#5b8bf7]">
                      {item.score.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1b263e] bg-[#0c1322] flex items-center justify-between text-xs">
          {history.length > 0 ? (
            <button
              onClick={() => {
                if (confirm('Konfirmasi: Hapus semua riwayat catatan sesi?')) {
                  sound.playClick();
                  onClearHistory();
                }
              }}
              className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
            >
              Reset Riwayat
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#162136] hover:bg-[#1f2e4c] border border-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
