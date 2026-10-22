/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GameMode, GameResult, GameSettings, QuickPreset } from './types/math';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { MentalMathTipsModal } from './components/MentalMathTipsModal';
import { HistoryModal } from './components/HistoryModal';
import {
  DEFAULT_SETTINGS,
  loadSavedSettings,
  saveSettings,
  loadGameHistory,
  saveGameResult,
  clearGameHistory,
} from './utils/storage';
import { sound } from './utils/sound';

type ViewState = 'home' | 'setup' | 'playing' | 'result';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [settings, setSettings] = useState<GameSettings>(() => loadSavedSettings());
  const [activeResult, setActiveResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>(() => loadGameHistory());

  const [isTipsOpen, setIsTipsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Keep sound mute state synced
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleSelectMode = (mode: GameMode) => {
    setSettings((prev) => ({
      ...prev,
      mode,
      timerType: mode === 'challenge' ? 'per-question' : 'stopwatch',
      timeLimitSeconds: mode === 'challenge' ? (prev.timeLimitSeconds > 0 ? prev.timeLimitSeconds : 7) : 0,
      lives: mode === 'challenge' ? (prev.lives > 0 ? prev.lives : 3) : 0,
    }));
    setCurrentView('setup');
  };

  const handleSelectPreset = (preset: QuickPreset) => {
    setSettings((prev) => ({
      ...prev,
      ...preset.settings,
      operands: preset.settings.operands ? [...preset.settings.operands] : prev.operands,
      operations: preset.settings.operations ? [...preset.settings.operations] : prev.operations,
    }));
    setCurrentView('setup');
  };

  const handleStartGame = (configuredSettings: GameSettings) => {
    setSettings(configuredSettings);
    saveSettings(configuredSettings);
    setCurrentView('playing');
  };

  const handleFinishGame = (result: GameResult) => {
    setActiveResult(result);
    saveGameResult(result);
    setHistory(loadGameHistory());
    setCurrentView('result');
  };

  const handleClearHistory = () => {
    clearGameHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-grid-blueprint text-slate-100 flex flex-col selection:bg-[#5b8bf7] selection:text-slate-950">
      <main className="flex-1 flex flex-col justify-center">
        {currentView === 'home' && (
          <HomeScreen
            onSelectMode={handleSelectMode}
            onSelectPreset={handleSelectPreset}
            onOpenTips={() => setIsTipsOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {currentView === 'setup' && (
          <SetupScreen
            initialSettings={settings}
            onStartGame={handleStartGame}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'playing' && (
          <GameScreen
            settings={settings}
            onFinishGame={handleFinishGame}
            onExit={() => setCurrentView('home')}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {currentView === 'result' && activeResult && (
          <ResultScreen
            result={activeResult}
            onPlayAgain={() => setCurrentView('playing')}
            onModifySettings={() => setCurrentView('setup')}
            onBackToMenu={() => setCurrentView('home')}
            onOpenTips={() => setIsTipsOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <MentalMathTipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
