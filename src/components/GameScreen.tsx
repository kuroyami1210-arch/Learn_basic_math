import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameResult,
  GameSettings,
  MathQuestion,
  QuestionRecord,
} from '../types/math';
import { generateQuestion } from '../utils/mathGenerator';
import { sound } from '../utils/sound';

interface GameScreenProps {
  settings: GameSettings;
  onFinishGame: (result: GameResult) => void;
  onExit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function GameScreen({
  settings,
  onFinishGame,
  onExit,
  isMuted,
  onToggleMute,
}: GameScreenProps) {
  // Game state
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() =>
    generateQuestion(settings, 1)
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const [livesRemaining, setLivesRemaining] = useState<number>(settings.lives);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Timing
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [questionTimeElapsed, setQuestionTimeElapsed] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [timeLeftForQuestion, setTimeLeftForQuestion] = useState<number>(
    settings.timeLimitSeconds
  );

  // Visual feedback
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const isFinishedRef = useRef<boolean>(false);

  const isChallenge = settings.mode === 'challenge';
  const correctCount = records.filter((r) => r.isCorrect).length;

  // Auto focus input
  useEffect(() => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionIndex, isPaused]);

  // Finish game callback
  const handleCompleteGame = useCallback(
    (finalRecords: QuestionRecord[]) => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;

      const totalTimeSec = (Date.now() - sessionStartTime) / 1000;
      const cCount = finalRecords.filter((r) => r.isCorrect).length;
      const wCount = finalRecords.filter((r) => !r.isCorrect).length;
      const accuracy =
        finalRecords.length > 0
          ? Math.round((cCount / finalRecords.length) * 100)
          : 0;

      const timeArray = finalRecords.map((r) => r.timeSpentSeconds);
      const fastestTime =
        timeArray.length > 0 ? Math.min(...timeArray.filter((t) => t > 0)) : 0;
      const avgTime =
        timeArray.length > 0
          ? timeArray.reduce((a, b) => a + b, 0) / timeArray.length
          : 0;

      const opNames = settings.operations.map((o) =>
        o === 'multiply' ? 'Perkalian' : o === 'add' ? 'Tambah' : o === 'subtract' ? 'Kurang' : 'Bagi'
      ).join(', ');

      const summary = `${opNames} (${settings.operands[0]?.scale} × ${settings.operands[1]?.scale})`;

      const result: GameResult = {
        id: `res-${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        mode: settings.mode,
        settingsSummary: summary,
        totalQuestions: finalRecords.length,
        correctCount: cCount,
        wrongCount: wCount,
        skippedCount: 0,
        accuracy,
        totalTimeSeconds: totalTimeSec,
        averageTimePerQuestion: avgTime,
        fastestTimeSeconds: fastestTime === Infinity ? 0 : fastestTime,
        score,
        maxStreak,
        records: finalRecords,
      };

      if (accuracy >= 80) {
        sound.playVictory();
      }

      onFinishGame(result);
    },
    [sessionStartTime, settings, score, maxStreak, onFinishGame]
  );

  // Move to next question or complete
  const moveToNextQuestion = useCallback(
    (record: QuestionRecord) => {
      const updatedRecords = [...records, record];
      setRecords(updatedRecords);

      const isGameOverByLives = settings.lives > 0 && livesRemaining - (record.isCorrect ? 0 : 1) <= 0;
      const isGameOverByCount = settings.questionCount !== -1 && questionIndex + 1 >= settings.questionCount;

      if (isGameOverByLives || isGameOverByCount) {
        handleCompleteGame(updatedRecords);
        return;
      }

      setQuestionIndex((prev) => prev + 1);
      const nextQ = generateQuestion(settings, questionIndex + 2);
      setCurrentQuestion(nextQ);
      setInputValue('');
      setFeedbackState('idle');
      setShowHint(false);
      setFeedbackText(null);
      setQuestionStartTime(Date.now());
      setQuestionTimeElapsed(0);
      setTimeLeftForQuestion(settings.timeLimitSeconds);
    },
    [records, settings, livesRemaining, questionIndex, handleCompleteGame]
  );

  // Submit Answer Action
  const handleSubmitAnswer = useCallback(() => {
    if (feedbackState !== 'idle' || isPaused) return;

    if (!inputValue && inputValue !== '0') return;

    const userNum = parseInt(inputValue.trim(), 10);
    const isCorrect = userNum === currentQuestion.correctAnswer;
    const timeSpent = Math.max(0.1, (Date.now() - questionStartTime) / 1000);

    const record: QuestionRecord = {
      question: currentQuestion,
      userAnswer: userNum,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((prev) => Math.max(prev, nextStreak));

      const basePoints = 100;
      const speedBonus = settings.timeLimitSeconds > 0
        ? Math.max(0, Math.round((timeLeftForQuestion / settings.timeLimitSeconds) * 50))
        : Math.max(0, Math.round(50 - timeSpent * 5));
      const streakBonus = nextStreak * 10;
      setScore((prev) => prev + basePoints + speedBonus + streakBonus);

      sound.playCorrect(nextStreak);
      setFeedbackState('correct');
      setFeedbackText('Tepat!');

      setTimeout(() => {
        moveToNextQuestion(record);
      }, 250);
    } else {
      setStreak(0);
      sound.playWrong();
      setFeedbackState('wrong');
      setFeedbackText(`Salah. Jawaban: ${currentQuestion.correctAnswer}`);

      if (settings.lives > 0) {
        setLivesRemaining((prev) => Math.max(0, prev - 1));
      }

      setTimeout(() => {
        moveToNextQuestion(record);
      }, 600);
    }
  }, [
    feedbackState,
    isPaused,
    inputValue,
    currentQuestion,
    questionStartTime,
    streak,
    settings,
    timeLeftForQuestion,
    moveToNextQuestion,
  ]);

  // Skip question
  const handleSkipQuestion = useCallback(() => {
    if (feedbackState !== 'idle' || isPaused) return;

    sound.playClick();
    const timeSpent = Math.max(0.1, (Date.now() - questionStartTime) / 1000);
    const record: QuestionRecord = {
      question: currentQuestion,
      userAnswer: null,
      isCorrect: false,
      timeSpentSeconds: timeSpent,
    };

    moveToNextQuestion(record);
  }, [feedbackState, isPaused, currentQuestion, questionStartTime, moveToNextQuestion]);

  // Timeout handler
  const handleTimeout = useCallback(() => {
    if (feedbackState !== 'idle' || isPaused) return;

    sound.playWrong();
    setFeedbackState('timeout');
    setStreak(0);
    if (settings.lives > 0) {
      setLivesRemaining((prev) => Math.max(0, prev - 1));
    }

    const timeSpent = settings.timeLimitSeconds;
    const record: QuestionRecord = {
      question: currentQuestion,
      userAnswer: null,
      isCorrect: false,
      timeSpentSeconds: timeSpent,
    };

    setFeedbackText(`Waktu Habis! Jawaban: ${currentQuestion.correctAnswer}`);

    setTimeout(() => {
      moveToNextQuestion(record);
    }, 650);
  }, [feedbackState, isPaused, settings.lives, settings.timeLimitSeconds, currentQuestion, moveToNextQuestion]);

  // Main Timer Loop
  useEffect(() => {
    if (isPaused || feedbackState !== 'idle') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSec = (now - questionStartTime) / 1000;
      setQuestionTimeElapsed(elapsedSec);
      setTotalElapsedTime((now - sessionStartTime) / 1000);

      if (settings.mode === 'challenge' && settings.timerType === 'per-question' && settings.timeLimitSeconds > 0) {
        const remaining = Math.max(0, settings.timeLimitSeconds - elapsedSec);
        setTimeLeftForQuestion(remaining);

        if (remaining <= 3 && remaining > 0 && Math.floor(remaining * 10) % 10 === 0) {
          sound.playUrgentTick();
        }

        if (remaining <= 0) {
          clearInterval(interval);
          handleTimeout();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    isPaused,
    feedbackState,
    questionStartTime,
    sessionStartTime,
    settings.mode,
    settings.timerType,
    settings.timeLimitSeconds,
    handleTimeout,
  ]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) {
        if (e.key === 'Escape') setIsPaused(false);
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        sound.playKeypad();
        setInputValue((prev) => (prev.length < 8 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        sound.playKeypad();
        setInputValue((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitAnswer();
      } else if (e.key === '-' || e.key === 'Minus') {
        setInputValue((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      } else if (e.key === 'Escape') {
        setIsPaused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, handleSubmitAnswer]);

  const formatStopwatch = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    const paddedSecs = parseFloat(secs) < 10 ? `0${secs}` : secs;
    return `${mins < 10 ? '0' + mins : mins}:${paddedSecs}`;
  };

  const timerPercent =
    settings.timeLimitSeconds > 0
      ? Math.max(0, Math.min(100, (timeLeftForQuestion / settings.timeLimitSeconds) * 100))
      : 100;

  // Split expression display into operands and operator
  const expressionParts = currentQuestion.expressionDisplay.split(' ');
  const num1 = expressionParts[0] || '';
  const opSymbol = expressionParts[1] || '×';
  const num2 = expressionParts[2] || '';

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 sm:px-6 flex flex-col min-h-[92vh] justify-between animate-fade-in font-sans">
      {/* Top Header - Exact match Screenshot 77 */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={() => {
            sound.playClick();
            setIsPaused(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-[#0f1728] border border-[#1b263e] hover:border-slate-600 text-xs text-slate-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>‹</span>
          <span>Keluar</span>
        </button>

        <div className="text-xs text-slate-400 font-medium">
          Soal <strong className="text-white">{questionIndex + 1}</strong> dari{' '}
          {settings.questionCount === -1 ? '∞' : settings.questionCount} · Benar{' '}
          <strong className="text-white">{correctCount}</strong>
        </div>
      </div>

      {/* Card 1: Timer & Stopwatch Readout (Exact match Screenshot 77) */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-[#1b263e] shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          {/* Left Timer */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {isChallenge ? 'SISA WAKTU' : 'WAKTU SOAL INI'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                {isChallenge ? timeLeftForQuestion.toFixed(1) : formatStopwatch(questionTimeElapsed)}
              </span>
              {isChallenge && (
                <span className="text-sm font-bold text-slate-400">
                  dtk
                </span>
              )}
            </div>
          </div>

          {/* Right Total Session Time */}
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              TOTAL
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatStopwatch(totalElapsedTime)}
            </div>
          </div>
        </div>

        {/* Blue Progress Bar */}
        {isChallenge && settings.timeLimitSeconds > 0 && (
          <div className="w-full h-1.5 bg-[#0a101d] rounded-full overflow-hidden border border-[#1b263e]/60">
            <div
              className="h-full bg-[#5b8bf7] transition-all duration-100 rounded-full"
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card 2: Main Question Card (Exact match Screenshot 77) */}
      <div
        className={`my-auto py-10 sm:py-14 rounded-2xl bg-[#0f1728] border text-center transition-all shadow-xl flex items-center justify-center ${
          feedbackState === 'correct'
            ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/40'
            : feedbackState === 'wrong' || feedbackState === 'timeout'
            ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/40 animate-shake'
            : 'border-[#1b263e]'
        }`}
      >
        <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white flex items-center justify-center gap-4 sm:gap-6 font-sans tabular-nums select-none">
          <span>{num1}</span>
          <span className="text-[#f87171]">{opSymbol}</span>
          <span>{num2}</span>
        </div>
      </div>

      {/* Card 3: JAWABANMU Input Section (Exact match Screenshot 77) */}
      <div className="space-y-3 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
          JAWABANMU
        </span>

        {/* Input Container */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`w-full h-18 sm:h-20 rounded-2xl bg-[#0a101d] border-2 flex items-center justify-center transition-all cursor-text ${
            feedbackState === 'correct'
              ? 'border-emerald-500 text-emerald-300'
              : feedbackState === 'wrong' || feedbackState === 'timeout'
              ? 'border-red-500 text-red-300'
              : inputValue
              ? 'border-[#5b8bf7] text-white shadow-lg shadow-blue-500/10'
              : 'border-[#1b263e] text-slate-600'
          }`}
        >
          {inputValue ? (
            <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-wider text-white">
              {inputValue}
            </span>
          ) : (
            <span className="text-4xl font-light text-slate-600 animate-pulse">
              |
            </span>
          )}
        </div>

        {/* Hidden input for mobile & desktop typing focus */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9-]/g, '');
            setInputValue(val.slice(0, 8));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitAnswer();
            }
          }}
          className="absolute opacity-0 pointer-events-none"
          aria-label="Ketik Jawaban"
        />

        {/* Feedback message banner if wrong/correct */}
        {feedbackText && (
          <div
            className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all ${
              feedbackState === 'correct'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {feedbackText}
          </div>
        )}

        {/* Action Buttons: Lewati & Jawab (Exact match Screenshot 77) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleSkipQuestion}
            className="py-3.5 px-4 rounded-xl bg-[#0f1728] hover:bg-[#162136] border border-[#1b263e] text-slate-300 font-semibold text-sm transition-colors cursor-pointer text-center"
          >
            Lewati
          </button>

          <button
            type="button"
            onClick={handleSubmitAnswer}
            className="py-3.5 px-4 rounded-xl bg-[#5b8bf7] hover:bg-[#4d7ef2] text-slate-950 font-bold text-sm transition-colors cursor-pointer text-center shadow-lg shadow-blue-500/15"
          >
            Jawab
          </button>
        </div>

        {/* Subtle Hint Footnote (Exact match Screenshot 77) */}
        <p className="text-center text-[11px] text-slate-500 leading-relaxed pt-1">
          Tekan Enter untuk menjawab. Saat jawaban salah muncul, Enter melanjutkan ke soal berikutnya.
        </p>

        {/* Tactical Keypad for Mobile Screen convenience */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 sm:hidden">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => {
                sound.playKeypad();
                setInputValue((prev) => (prev.length < 8 ? prev + digit : prev));
              }}
              className="h-11 rounded-xl bg-[#0f1728] border border-[#1b263e] text-white font-mono font-bold text-lg active:bg-[#5b8bf7] active:text-slate-950 transition-colors"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              sound.playKeypad();
              setInputValue('');
            }}
            className="h-11 rounded-xl bg-[#0f1728] border border-[#1b263e] text-red-400 font-semibold text-xs active:bg-red-500 active:text-white"
          >
            Hapus
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playKeypad();
              setInputValue((prev) => (prev.length < 8 ? prev + '0' : prev));
            }}
            className="h-11 rounded-xl bg-[#0f1728] border border-[#1b263e] text-white font-mono font-bold text-lg active:bg-[#5b8bf7] active:text-slate-950 transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playKeypad();
              setInputValue((prev) => prev.slice(0, -1));
            }}
            className="h-11 rounded-xl bg-[#0f1728] border border-[#1b263e] text-slate-300 font-bold active:bg-slate-700"
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f1728] border border-[#1b263e] p-6 text-center space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-white">
              Permainan Dijeda
            </h3>
            <p className="text-xs text-slate-400">
              Waktu dihentikan sementara. Klik lanjutkan bila telah siap.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-xl bg-[#5b8bf7] hover:bg-[#4d7ef2] text-slate-950 font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
              >
                Lanjutkan Permainan
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onExit();
                }}
                className="w-full py-3 rounded-xl bg-[#0a101d] border border-[#1b263e] hover:border-slate-600 text-slate-300 font-semibold text-xs uppercase tracking-wide transition-colors cursor-pointer"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
