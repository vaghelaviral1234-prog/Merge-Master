/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Coins,
  Trophy,
  Castle,
  Target,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  score: number;
  bestScore: number;
  coins: number;
  playerLevel: number;
  playerExp: number;
  expToNextLevel: number;
  nickname: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  activeTab: 'board' | 'empire' | 'missions' | 'rewards' | 'shop' | 'settings';
  onSelectTab: (tab: 'board' | 'empire' | 'missions' | 'rewards' | 'shop' | 'settings') => void;
  hasUnclaimedMissions: boolean;
  uncollectedEmpireCoins: number;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  coins,
  playerLevel,
  playerExp,
  expToNextLevel,
  nickname,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onOpenProfile,
  onOpenSettings,
  activeTab,
  onSelectTab,
  hasUnclaimedMissions,
  uncollectedEmpireCoins,
}) => {
  const expPercent = Math.min(100, Math.floor((playerExp / expToNextLevel) * 100));

  return (
    <header className="w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-3 py-2">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Player Profile & Level */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenProfile();
          }}
          className="flex items-center gap-2 min-w-0 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="Open Player Profile"
        >
          <div className="flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400/30 shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-[9px] font-bold uppercase leading-none opacity-80">LVL</span>
            <span className="text-sm font-extrabold font-mono leading-none">{playerLevel}</span>
          </div>

          <div className="flex flex-col min-w-[70px] sm:min-w-[100px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-0.5">
              <span className="truncate max-w-[70px] sm:max-w-[90px] font-bold text-white">
                {nickname}
              </span>
              <span className="tabular-nums text-slate-400">{expPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </button>

        {/* Center: Score & Coins Cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Score Counter */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Score</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-100">
              {score}
              {bestScore > 0 && (
                <span className="text-[10px] text-slate-500 font-normal ml-1 hidden sm:inline">
                  (Best: {bestScore})
                </span>
              )}
            </div>
          </div>

          {/* Virtual Coin Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-amber-300">
              {coins}
            </span>
          </div>
        </div>

        {/* Right: Quick Tab Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Empire Button */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab(activeTab === 'empire' ? 'board' : 'empire');
            }}
            className={`relative p-2 rounded-xl border transition-all ${
              activeTab === 'empire'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
            title="Royal Empire"
            aria-label="Royal Empire"
          >
            <Castle className="w-4 h-4" />
            {uncollectedEmpireCoins > 0 && activeTab !== 'empire' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </button>

          {/* Missions Button */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('missions');
            }}
            className="relative p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
            title="Missions & Quests"
            aria-label="Missions & Quests"
          >
            <Target className="w-4 h-4" />
            {hasUnclaimedMissions && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition-all ${
              musicEnabled
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-400'
                : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}
            title={musicEnabled ? 'Mute Music' : 'Enable Ambient Music'}
            aria-label={musicEnabled ? 'Mute Music' : 'Enable Ambient Music'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
            title="Settings & Profile"
            aria-label="Settings & Profile"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
