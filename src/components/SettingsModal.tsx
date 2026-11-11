/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameSettings, GameStats } from '../types/game';
import { OBJECT_LEVELS } from '../constants/gameData';
import { ObjectIllustration } from './ObjectIllustration';
import { sound, triggerHaptic } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Music,
  Smartphone,
  Eye,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  X,
  BarChart3,
  User,
} from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  stats: GameStats;
  nickname: string;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenProfile: () => void;
  onReplayTutorial: () => void;
  onRestartGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  stats,
  nickname,
  onUpdateSettings,
  onOpenProfile,
  onReplayTutorial,
  onRestartGame,
  onClose,
}) => {
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const highestTierDef = OBJECT_LEVELS[stats.highestTierReached - 1] || OBJECT_LEVELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-bold font-display text-white mb-4">Settings & Preferences</h3>

        {/* Player Profile Quick Banner */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{nickname}</div>
              <div className="text-xs text-slate-400">Botanist Sovereign</div>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Audio & Haptic Toggles */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Audio & Controls
          </h4>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sound Effects (SFX)</div>
                <div className="text-xs text-slate-400">Merges, clicks, and chimes</div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Ambient Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Background Music (BGM)</div>
                <div className="text-xs text-slate-400">Gentle ambient fantasy melody</div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ musicEnabled: !settings.musicEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.musicEnabled ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Vibration Feedback</div>
                <div className="text-xs text-slate-400">Tactile haptics on mobile devices</div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                triggerHaptic(20);
                onUpdateSettings({ hapticEnabled: !settings.hapticEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.hapticEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Reduced Motion</div>
                <div className="text-xs text-slate-400">Subdue bursts and pop animations</div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onReplayTutorial();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>How to Play (Replay Tutorial)</span>
          </button>

          {!showRestartConfirm ? (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 border border-rose-900/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game Board / Restart</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Reset board and start a fresh run?</span>
              </div>
              <p className="text-[11px] text-rose-300/80">
                Your coins, empire structures, and achievements will remain preserved safely.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    sound.playClick();
                    onRestartGame();
                    setShowRestartConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  Yes, Reset Board
                </button>
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
