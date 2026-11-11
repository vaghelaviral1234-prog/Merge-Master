/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile, GameStats, Achievement } from '../types/game';
import { OBJECT_LEVELS } from '../constants/gameData';
import { ObjectIllustration } from './ObjectIllustration';
import { sound, triggerHaptic } from '../utils/audio';
import { User, Trophy, Coins, Award, Edit2, Check, X, Shield, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  profile: PlayerProfile;
  playerLevel: number;
  playerExp: number;
  expToNextLevel: number;
  score: number;
  bestScore: number;
  stats: GameStats;
  achievements: Achievement[];
  onUpdateNickname: (nickname: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  playerLevel,
  playerExp,
  expToNextLevel,
  score,
  bestScore,
  stats,
  achievements,
  onUpdateNickname,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);

  const highestTierDef = OBJECT_LEVELS[stats.highestTierReached - 1] || OBJECT_LEVELS[0];
  const unlockedCount = achievements.filter((a) => a.completed).length;
  const expPercent = Math.min(100, Math.floor((playerExp / expToNextLevel) * 100));

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (trimmed.length >= 2 && trimmed.length <= 20) {
      sound.playClick();
      triggerHaptic(20);
      onUpdateNickname(trimmed);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          aria-label="Close profile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-5 pt-1">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-400/40 p-1 flex items-center justify-center shadow-lg">
              <ObjectIllustration
                level={stats.highestTierReached}
                size="lg"
                showBadge={false}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 font-mono font-bold text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full border border-black/40 shadow">
              LVL {playerLevel}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={20}
                  className="bg-slate-950 border border-emerald-500 rounded-xl px-2.5 py-1 text-sm font-bold text-white focus:outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={handleSaveNickname}
                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                  title="Save Nickname"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setNicknameInput(profile.nickname);
                    setIsEditing(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-white truncate">
                  {profile.nickname}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-400 hover:text-emerald-400 p-1 transition-colors"
                  title="Edit Nickname"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>{profile.title}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Member since {profile.joinedDate}
            </div>
          </div>
        </div>

        {/* Player EXP Progress Strip */}
        <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 mb-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Rank Progress (Level {playerLevel})</span>
            <span className="tabular-nums">
              {playerExp} / {expToNextLevel} EXP ({expPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Career Records
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Score</span>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                {score}
                {bestScore > score && (
                  <span className="text-xs text-slate-500 ml-1 font-normal">
                    (Best: {bestScore})
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Merges</span>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {stats.totalMerges}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Coins Earned</span>
              <div className="text-base font-bold font-mono text-amber-300 tabular-nums flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{stats.totalCoinsEarned}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Highest Combo</span>
              <div className="text-base font-bold font-mono text-purple-400 tabular-nums">
                {stats.highestCombo}x
              </div>
            </div>
          </div>
        </div>

        {/* Highest Botanical Discovery */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Apex Botanical Discovery
            </span>
            <div className="text-sm font-bold text-white mt-0.5">
              Level {stats.highestTierReached}: {highestTierDef.name}
            </div>
            <div className="text-xs text-slate-400">{highestTierDef.tagline}</div>
          </div>
          <ObjectIllustration level={stats.highestTierReached} size="lg" />
        </div>

        {/* Achievements Summary */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Unlocked Feats
            </h4>
            <span className="text-xs font-mono font-bold text-amber-300">
              {unlockedCount} / {achievements.length}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  ach.completed
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                      ach.completed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold">{ach.title}</span>
                    <p className="text-[11px] text-slate-400 leading-tight">{ach.description}</p>
                  </div>
                </div>

                <span className="font-mono text-[11px] tabular-nums shrink-0">
                  {ach.completed ? 'Unlocked' : `${ach.current}/${ach.target}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
